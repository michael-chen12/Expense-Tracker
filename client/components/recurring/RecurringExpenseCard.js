'use client';

const FREQUENCY_LABELS = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

export default function RecurringExpenseCard({ recurring, onDelete, onEdit }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{recurring.category}</h3>
          <p className="text-sm text-gray-600 mt-1">{FREQUENCY_LABELS[recurring.frequency]}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900">${recurring.amount.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Next: {formatDate(recurring.nextDate)}</p>
        </div>
      </div>

      {recurring.note && (
        <p className="text-sm text-gray-600 mb-3 italic">{recurring.note}</p>
      )}

      {recurring.endDate && (
        <p className="text-xs text-gray-500 mb-3">Ends: {formatDate(recurring.endDate)}</p>
      )}

      <div className="flex gap-2 justify-end">
        {onEdit && (
          <button
            onClick={() => onEdit(recurring)}
            className="px-3 py-1 text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => onDelete(recurring.id)}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
