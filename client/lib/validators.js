/**
 * Form Validation Utilities
 * Centralized validation logic following Single Responsibility Principle
 * Reduces duplication and improves maintainability
 */

/**
 * Validate expense form data
 * @param {Object} form - Form data to validate
 * @param {string|number} form.amount - Expense amount
 * @param {string} form.category - Expense category
 * @param {string} form.date - Expense date
 * @returns {string|null} Error message or null if valid
 */
export function validateExpenseForm(form) {
  // Validate amount
  const amountValue = Number(form.amount);
  if (!form.amount || Number.isNaN(amountValue) || amountValue < 0) {
    return 'Enter a valid amount.';
  }

  // Validate category
  const trimmedCategory = form.category?.trim();
  if (!trimmedCategory) {
    return 'Pick a category.';
  }

  // Validate date
  if (!form.date) {
    return 'Select a date.';
  }

  return null;
}

/**
 * Validate recurring expense form data
 * @param {Object} form - Form data to validate
 * @returns {string|null} Error message or null if valid
 */
export function validateRecurringExpenseForm(form) {
  // Validate amount
  const amountValue = Number(form.amount);
  if (!form.amount || Number.isNaN(amountValue) || amountValue <= 0) {
    return 'Enter a valid amount greater than zero.';
  }

  // Validate category
  if (!form.category?.trim()) {
    return 'Category is required.';
  }

  // Validate frequency
  if (!form.frequency) {
    return 'Select a frequency.';
  }

  // Frequency-specific validation
  if (form.frequency === 'weekly' && (form.dayOfWeek === null || form.dayOfWeek === undefined)) {
    return 'Select a day of the week.';
  }

  if (form.frequency === 'monthly' && !form.dayOfMonth) {
    return 'Select a day of the month.';
  }

  if (form.frequency === 'yearly') {
    if (!form.dayOfMonth) {
      return 'Select a day of the month for yearly expenses.';
    }
    if (form.monthOfYear === null || form.monthOfYear === undefined) {
      return 'Select a month of the year.';
    }
  }

  // Validate next date
  if (!form.nextDate) {
    return 'Select a next occurrence date.';
  }

  // Validate end date if provided
  if (form.endDate) {
    const nextDate = new Date(form.nextDate);
    const endDate = new Date(form.endDate);
    if (endDate < nextDate) {
      return 'End date must be after the next occurrence date.';
    }
  }

  return null;
}

/**
 * Validate allowance settings
 * @param {Object} allowance - Allowance data to validate
 * @param {string|number} allowance.amount - Allowance amount
 * @param {string} allowance.cadence - Allowance cadence
 * @returns {string|null} Error message or null if valid
 */
export function validateAllowance(allowance) {
  const amount = Number(allowance.amount);
  
  if (!allowance.amount || Number.isNaN(amount) || amount < 0) {
    return 'Enter a valid allowance amount.';
  }

  if (!allowance.cadence || !['week', 'month', 'year'].includes(allowance.cadence)) {
    return 'Select a valid allowance period.';
  }

  return null;
}

/**
 * Sanitize form input by trimming whitespace
 * @param {Object} form - Form data to sanitize
 * @returns {Object} Sanitized form data
 */
export function sanitizeFormData(form) {
  const sanitized = { ...form };
  
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitized[key].trim();
    }
  });
  
  return sanitized;
}

/**
 * Check if a value is a valid date
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid date
 */
export function isValidDate(dateString) {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validate date range
 * @param {string} fromDate - Start date
 * @param {string} toDate - End date
 * @returns {string|null} Error message or null if valid
 */
export function validateDateRange(fromDate, toDate) {
  if (!isValidDate(fromDate)) {
    return 'Invalid start date.';
  }

  if (!isValidDate(toDate)) {
    return 'Invalid end date.';
  }

  const from = new Date(fromDate);
  const to = new Date(toDate);

  if (to < from) {
    return 'End date must be after start date.';
  }

  return null;
}
