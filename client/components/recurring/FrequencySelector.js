'use client';

export default function FrequencySelector({ frequency, onChange, dayOfWeek, dayOfMonth, monthOfYear }) {
  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <label htmlFor="frequency">Frequency</label>
        <select
          id="frequency"
          name="frequency"
          value={frequency}
          onChange={onChange}
          required
        >
          <option value="">Select frequency</option>
          {frequencies.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {frequency === 'weekly' && (
        <div>
          <label htmlFor="dayOfWeek">Day of Week</label>
          <select
            id="dayOfWeek"
            name="dayOfWeek"
            value={dayOfWeek ?? ''}
            onChange={onChange}
            required
          >
            <option value="">Select day</option>
            {daysOfWeek.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
      )}

      {frequency === 'monthly' && (
        <div>
          <label htmlFor="dayOfMonth">Day of Month</label>
          <input
            id="dayOfMonth"
            name="dayOfMonth"
            type="number"
            min="1"
            max="31"
            value={dayOfMonth ?? ''}
            onChange={onChange}
            placeholder="1-31"
            required
          />
        </div>
      )}

      {frequency === 'yearly' && (
        <>
          <div>
            <label htmlFor="monthOfYear">Month</label>
            <select
              id="monthOfYear"
              name="monthOfYear"
              value={monthOfYear ?? ''}
              onChange={onChange}
              required
            >
              <option value="">Select month</option>
              {months.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="dayOfMonth">Day of Month</label>
            <input
              id="dayOfMonth"
              name="dayOfMonth"
              type="number"
              min="1"
              max="31"
              value={dayOfMonth ?? ''}
              onChange={onChange}
              placeholder="1-31"
              required
            />
          </div>
        </>
      )}
    </div>
  );
}
