'use client';

export default function FrequencySelector({ frequency, onChange, dayOfWeek, dayOfMonth, monthOfYear, onDetailsChange }) {
  const handleFrequencyChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
          Frequency
        </label>
        <select
          id="frequency"
          value={frequency}
          onChange={handleFrequencyChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {frequency === 'weekly' && (
        <div>
          <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700 mb-2">
            Day of Week
          </label>
          <select
            id="dayOfWeek"
            value={dayOfWeek || 0}
            onChange={(e) => onDetailsChange('dayOfWeek', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value={0}>Sunday</option>
            <option value={1}>Monday</option>
            <option value={2}>Tuesday</option>
            <option value={3}>Wednesday</option>
            <option value={4}>Thursday</option>
            <option value={5}>Friday</option>
            <option value={6}>Saturday</option>
          </select>
        </div>
      )}

      {frequency === 'monthly' && (
        <div>
          <label htmlFor="dayOfMonth" className="block text-sm font-medium text-gray-700 mb-2">
            Day of Month
          </label>
          <input
            id="dayOfMonth"
            type="number"
            min="1"
            max="31"
            value={dayOfMonth || 1}
            onChange={(e) => onDetailsChange('dayOfMonth', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      )}

      {frequency === 'yearly' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="monthOfYear" className="block text-sm font-medium text-gray-700 mb-2">
              Month
            </label>
            <select
              id="monthOfYear"
              value={monthOfYear || 1}
              onChange={(e) => onDetailsChange('monthOfYear', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(2024, i, 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="dayOfMonth" className="block text-sm font-medium text-gray-700 mb-2">
              Day
            </label>
            <input
              id="dayOfMonth"
              type="number"
              min="1"
              max="31"
              value={dayOfMonth || 1}
              onChange={(e) => onDetailsChange('dayOfMonth', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
