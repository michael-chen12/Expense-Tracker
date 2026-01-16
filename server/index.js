const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const PORT = process.env.PORT || 4000;
const DB_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DB_DIR, 'expenses.db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount_cents INTEGER NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL
    )`
  );
});

const app = express();
app.use(cors());
app.use(express.json());

function parseAmountToCents(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) {
    return null;
  }
  return Math.round(amount * 100);
}

function centsToDollars(cents) {
  return Number((cents / 100).toFixed(2));
}

function mapExpense(row) {
  return {
    id: row.id,
    amount: centsToDollars(row.amount_cents),
    category: row.category,
    date: row.date,
    note: row.note || '',
    createdAt: row.created_at
  };
}

function buildFilter(query) {
  const where = [];
  const params = [];

  if (query.from) {
    where.push('date >= ?');
    params.push(query.from);
  }

  if (query.to) {
    where.push('date <= ?');
    params.push(query.to);
  }

  if (query.category) {
    where.push('category = ?');
    params.push(query.category);
  }

  return {
    whereSql: where.length ? `WHERE ${where.join(' AND ')}` : '',
    params
  };
}

function validateExpense(payload) {
  const amountCents = parseAmountToCents(payload.amount);
  if (amountCents === null) {
    return { error: 'Amount must be a positive number.' };
  }

  const category = String(payload.category || '').trim();
  if (!category) {
    return { error: 'Category is required.' };
  }

  const date = String(payload.date || '').trim();
  if (!date) {
    return { error: 'Date is required.' };
  }

  const note = payload.note ? String(payload.note).trim() : '';

  return {
    value: {
      amountCents,
      category,
      date,
      note
    }
  };
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/expenses', (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(req.query.pageSize, 10) || 20, 1), 100);
  const offset = (page - 1) * pageSize;

  const { whereSql, params } = buildFilter(req.query);

  db.get(
    `SELECT COUNT(*) as count FROM expenses ${whereSql}`,
    params,
    (countErr, countRow) => {
      if (countErr) {
        return res.status(500).json({ error: 'Failed to load expenses.' });
      }

      db.all(
        `SELECT * FROM expenses ${whereSql} ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?`,
        [...params, pageSize, offset],
        (err, rows) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to load expenses.' });
          }

          res.json({
            items: rows.map(mapExpense),
            page,
            pageSize,
            totalCount: countRow.count
          });
        }
      );
    }
  );
});

app.get('/api/expenses/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Invalid expense id.' });
  }

  db.get('SELECT * FROM expenses WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load expense.' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Expense not found.' });
    }
    res.json({ item: mapExpense(row) });
  });
});

app.post('/api/expenses', (req, res) => {
  const { value, error } = validateExpense(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const createdAt = new Date().toISOString();

  db.run(
    `INSERT INTO expenses (amount_cents, category, date, note, created_at)
     VALUES (?, ?, ?, ?, ?)` ,
    [value.amountCents, value.category, value.date, value.note, createdAt],
    function insertCallback(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create expense.' });
      }

      db.get('SELECT * FROM expenses WHERE id = ?', [this.lastID], (getErr, row) => {
        if (getErr) {
          return res.status(500).json({ error: 'Failed to load expense.' });
        }
        res.status(201).json({ item: mapExpense(row) });
      });
    }
  );
});

app.put('/api/expenses/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Invalid expense id.' });
  }

  const { value, error } = validateExpense(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  db.run(
    `UPDATE expenses
     SET amount_cents = ?, category = ?, date = ?, note = ?
     WHERE id = ?`,
    [value.amountCents, value.category, value.date, value.note, id],
    function updateCallback(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update expense.' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Expense not found.' });
      }

      db.get('SELECT * FROM expenses WHERE id = ?', [id], (getErr, row) => {
        if (getErr) {
          return res.status(500).json({ error: 'Failed to load expense.' });
        }
        res.json({ item: mapExpense(row) });
      });
    }
  );
});

app.delete('/api/expenses/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Invalid expense id.' });
  }

  db.run('DELETE FROM expenses WHERE id = ?', [id], function deleteCallback(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete expense.' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Expense not found.' });
    }

    res.json({ success: true });
  });
});

app.get('/api/summary', (req, res) => {
  const { whereSql, params } = buildFilter(req.query);

  db.get(
    `SELECT COALESCE(SUM(amount_cents), 0) as totalCents FROM expenses ${whereSql}`,
    params,
    (totalErr, totalRow) => {
      if (totalErr) {
        return res.status(500).json({ error: 'Failed to load summary.' });
      }

      db.all(
        `SELECT category, SUM(amount_cents) as totalCents
         FROM expenses
         ${whereSql}
         GROUP BY category
         ORDER BY totalCents DESC`,
        params,
        (groupErr, rows) => {
          if (groupErr) {
            return res.status(500).json({ error: 'Failed to load summary.' });
          }

          const byCategory = rows.map((row) => ({
            category: row.category,
            totalCents: row.totalCents,
            total: centsToDollars(row.totalCents)
          }));

          res.json({
            totalCents: totalRow.totalCents,
            total: centsToDollars(totalRow.totalCents),
            byCategory
          });
        }
      );
    }
  );
});

app.listen(PORT, () => {
  console.log(`Expense API running on http://localhost:${PORT}`);
});
