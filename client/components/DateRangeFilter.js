'use client';

import { useState } from 'react';

/**
 * Date Range Filter Component
 * Allows users to select custom date ranges or use preset options
 */
export default function DateRangeFilter({ dateRange, onDateRangeChange }) {
  const [showCustom, setShowCustom] = useState(false);
  const [customFrom, setCustomFrom] = useState(dateRange.from);
  const [customTo, setCustomTo] = useState(dateRange.to);

  // Preset date range options
  const presets = [
    {
      label: 'This Month',
      getValue: () => {
        const today = new Date();
        const from = new Date(today.getFullYear(), today.getMonth(), 1);
        const to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return {
          from: from.toISOString().slice(0, 10),
          to: to.toISOString().slice(0, 10),
          label: today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        };
      }
    },
    {
      label: 'Last Month',
      getValue: () => {
        const today = new Date();
        const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const to = new Date(today.getFullYear(), today.getMonth(), 0);
        return {
          from: from.toISOString().slice(0, 10),
          to: to.toISOString().slice(0, 10),
          label: from.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        };
      }
    },
    {
      label: 'Last 3 Months',
      getValue: () => {
        const today = new Date();
        const from = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        const to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return {
          from: from.toISOString().slice(0, 10),
          to: to.toISOString().slice(0, 10),
          label: 'Last 3 Months'
        };
      }
    },
    {
      label: 'Last 6 Months',
      getValue: () => {
        const today = new Date();
        const from = new Date(today.getFullYear(), today.getMonth() - 5, 1);
        const to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return {
          from: from.toISOString().slice(0, 10),
          to: to.toISOString().slice(0, 10),
          label: 'Last 6 Months'
        };
      }
    },
    {
      label: 'This Year',
      getValue: () => {
        const today = new Date();
        const from = new Date(today.getFullYear(), 0, 1);
        const to = new Date(today.getFullYear(), 11, 31);
        return {
          from: from.toISOString().slice(0, 10),
          to: to.toISOString().slice(0, 10),
          label: today.getFullYear().toString()
        };
      }
    },
    {
      label: 'All Time',
      getValue: () => {
        const today = new Date();
        return {
          from: '2000-01-01',
          to: today.toISOString().slice(0, 10),
          label: 'All Time'
        };
      }
    }
  ];

  const handlePresetClick = (preset) => {
    const range = preset.getValue();
    onDateRangeChange(range);
    setShowCustom(false);
  };

  const handleCustomApply = () => {
    if (customFrom && customTo) {
      const from = new Date(customFrom);
      const to = new Date(customTo);
      const label = `${from.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${to.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;

      onDateRangeChange({
        from: customFrom,
        to: customTo,
        label
      });
      setShowCustom(false);
    }
  };

  return (
    <div className="date-range-filter">
      <div className="filter-header">
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1b1b1b' }}>
          Date Range
        </h3>
        <span style={{ fontSize: '14px', color: '#6b645b', fontWeight: '500' }}>
          {dateRange.label}
        </span>
      </div>

      <div className="preset-buttons">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="preset-button"
            onClick={() => handlePresetClick(preset)}
          >
            {preset.label}
          </button>
        ))}
        <button
          type="button"
          className="preset-button custom-button"
          onClick={() => setShowCustom(!showCustom)}
        >
          {showCustom ? 'Cancel' : 'Custom Range'}
        </button>
      </div>

      {showCustom && (
        <div className="custom-range-inputs">
          <div className="input-group">
            <label htmlFor="custom-from">From</label>
            <input
              id="custom-from"
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              max={customTo}
            />
          </div>
          <div className="input-group">
            <label htmlFor="custom-to">To</label>
            <input
              id="custom-to"
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              min={customFrom}
            />
          </div>
          <button
            type="button"
            className="button primary"
            onClick={handleCustomApply}
            disabled={!customFrom || !customTo}
          >
            Apply
          </button>
        </div>
      )}

      <style jsx>{`
        .date-range-filter {
          background: #ffffff;
          border: 1px solid #e5dccf;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .preset-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .preset-button {
          padding: 8px 16px;
          border: 1px solid #e5dccf;
          border-radius: 8px;
          background: #ffffff;
          color: #1b1b1b;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .preset-button:hover {
          background: #f8f6f2;
          border-color: #ff7a00;
        }

        .preset-button:active {
          transform: scale(0.98);
        }

        .custom-button {
          border-color: #ff7a00;
          color: #ff7a00;
        }

        .custom-range-inputs {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e5dccf;
          display: flex;
          gap: 12px;
          align-items: flex-end;
        }

        .input-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-group label {
          font-size: 13px;
          font-weight: 500;
          color: #6b645b;
        }

        .input-group input {
          padding: 8px 12px;
          border: 1px solid #e5dccf;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
        }

        .input-group input:focus {
          outline: none;
          border-color: #ff7a00;
        }

        @media (max-width: 640px) {
          .custom-range-inputs {
            flex-direction: column;
            align-items: stretch;
          }

          .input-group {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
