'use client';

import RecurringExpenseCard from './RecurringExpenseCard';

export default function RecurringExpenseList({ recurring, isLoading, onDelete, onEdit }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!recurring || recurring.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No recurring expenses yet.</p>
        <p className="text-sm text-gray-500">Create one to automate your regular payments.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {recurring.map((item) => (
        <RecurringExpenseCard
          key={item.id}
          recurring={item}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
