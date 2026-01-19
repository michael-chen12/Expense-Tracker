'use client';

import { useState } from 'react';
import { Modal, ModalActions } from '@/components/Modal';
import { formatCurrency, formatDate } from '@/lib/format';

export default function RecurringExpenseCard({ recurringExpense, onDelete, onEdit }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getFrequencyLabel = (freq, dayOfWeek, dayOfMonth, monthOfYear) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    switch (freq) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return `Weekly on ${daysOfWeek[dayOfWeek]}`;
      case 'monthly':
        return `Monthly on day ${dayOfMonth}`;
      case 'yearly':
        return `Yearly on ${months[monthOfYear]} ${dayOfMonth}`;
      default:
        return freq;
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(recurringExpense.id);
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="card" style={{ padding: '16px', transition: 'transform 0.2s, box-shadow 0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0' }}>{recurringExpense.category}</h3>
          <p className="subtle" style={{ margin: 0, fontSize: '14px' }}>
            {getFrequencyLabel(
              recurringExpense.frequency,
              recurringExpense.dayOfWeek,
              recurringExpense.dayOfMonth,
              recurringExpense.monthOfYear
            )}
          </p>
        </div>
        <div style={{ fontSize: '20px', fontWeight: '700', color: '#ff7a00' }}>
          {formatCurrency(recurringExpense.amount)}
        </div>
      </div>

      {recurringExpense.note && (
        <p className="subtle" style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
          {recurringExpense.note}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5dccf' }}>
        <div>
          <p className="subtle" style={{ margin: 0, fontSize: '12px' }}>Next: {formatDate(recurringExpense.nextDate)}</p>
          {recurringExpense.endDate && (
            <p className="subtle" style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
              Ends: {formatDate(recurringExpense.endDate)}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="button ghost"
            onClick={() => onEdit(recurringExpense)}
            aria-label={`Edit ${recurringExpense.category}`}
            style={{ padding: '8px' }}
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            type="button"
            className="button ghost"
            onClick={() => setShowDeleteModal(true)}
            aria-label={`Delete ${recurringExpense.category}`}
            style={{ padding: '8px' }}
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete recurring expense"
        description="This will remove all future occurrences of this recurring expense."
      >
        <div className="modal-detail-card">
          <div className="modal-detail-header">
            <div>
              <p className="modal-detail-title">{recurringExpense.category}</p>
              <p className="modal-detail-meta">Next: {formatDate(recurringExpense.nextDate)}</p>
              {recurringExpense.endDate ? (
                <p className="modal-detail-meta">Ends: {formatDate(recurringExpense.endDate)}</p>
              ) : null}
            </div>
            <p className="modal-detail-amount">{formatCurrency(recurringExpense.amount)}</p>
          </div>
          <p className="modal-detail-meta">Frequency: {getFrequencyLabel(
            recurringExpense.frequency,
            recurringExpense.dayOfWeek,
            recurringExpense.dayOfMonth,
            recurringExpense.monthOfYear
          )}</p>
          <p className="modal-detail-note">{recurringExpense.note || 'No note provided.'}</p>
        </div>

        <p className="modal-message">Delete recurring expense?</p>
        <ModalActions>
          <button
            type="button"
            className="button ghost"
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="button primary"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </ModalActions>
      </Modal>
    </div>
  );
}
