'use client';

import { useState, useEffect } from 'react';
import { FormCard, FormSection, FormLabel } from '@/components/Form';
import './DateRangeFilter.css';

/**
 * Date Range Filter Component
 * Allows users to select custom date ranges or use preset options
 * Now with proper mobile viewport detection and accessibility
 */
export default function DateRangeFilter({ dateRange, onDateRangeChange }) {
  const [showCustom, setShowCustom] = useState(false);
  const [customFrom, setCustomFrom] = useState(dateRange.from);
  const [customTo, setCustomTo] = useState(dateRange.to);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Properly detect mobile viewport with resize listener
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 640px)').matches);
    };
    
    // Initial check
    checkMobile();
    
    // Listen for viewport changes
    const mediaQuery = window.matchMedia('(max-width: 640px)');
    const handler = (e) => setIsMobile(e.matches);
    
    // Modern approach
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  // Preset date range options
  const presets = [
    {
      label: 'Last 7 Days',
      getValue: () => {
        const today = new Date();
        const from = new Date(today);
        from.setDate(today.getDate() - 6);
        return {
          from: from.toISOString().slice(0, 10),
          to: today.toISOString().slice(0, 10),
          label: 'Last 7 Days'
        };
      }
    },
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
    <FormCard className="date-range-filter-card">
      <FormSection>
        <div className="filter-header">
          <div className="filter-header-left">
            <h3>Date Range</h3>
            <span>{dateRange.label}</span>
          </div>
          {isMobile && (
            <button
              className="preset-dropdown-toggle"
              type="button"
              aria-expanded={dropdownOpen}
              aria-controls="preset-dropdown"
              aria-label={dropdownOpen ? 'Collapse date range options' : 'Expand date range options'}
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ 
                  transition: 'transform 0.3s ease', 
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' 
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          )}
        </div>
        <div
          id="preset-dropdown"
          className={`preset-buttons preset-dropdown${isMobile ? (dropdownOpen ? ' open' : '') : ''}`}
          style={isMobile ? {
            maxHeight: dropdownOpen ? 1000 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)'
          } : {}}
        >
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="preset-button"
              onClick={() => handlePresetClick(preset)}
              aria-label={`Filter by ${preset.label}`}
            >
              {preset.label}
            </button>
          ))}
          <button
            type="button"
            className="preset-button custom-button"
            onClick={() => setShowCustom(!showCustom)}
            aria-expanded={showCustom}
            aria-controls="custom-range-inputs"
          >
            {showCustom ? 'Cancel' : 'Custom Range'}
          </button>
        </div>
        {showCustom && (
          <div id="custom-range-inputs" className="custom-range-inputs">
            <div className="input-group">
              <FormLabel htmlFor="custom-from">From</FormLabel>
              <input
                id="custom-from"
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                max={customTo}
                className="form-input"
                aria-required="true"
              />
            </div>
            <div className="input-group">
              <FormLabel htmlFor="custom-to">To</FormLabel>
              <input
                id="custom-to"
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                min={customFrom}
                className="form-input"
                aria-required="true"
              />
            </div>
            <button
              type="button"
              className="button primary"
              onClick={handleCustomApply}
              disabled={!customFrom || !customTo}
              aria-label="Apply custom date range"
            >
              Apply
            </button>
          </div>
        )}
      </FormSection>
    </FormCard>
  );
}
