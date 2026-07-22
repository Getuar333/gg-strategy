const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const UTC_MIDNIGHT_DATE_PATTERN = /^(\d{4}-\d{2}-\d{2})T00:00:00(?:\.000)?Z$/;
const TIME_ONLY_PATTERN = /^([01]?\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?$/;

const pad = (value) => String(value).padStart(2, '0');

const validationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

export const formatLocalDateOnly = (date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const normalizeDateOnly = (value, fieldName = 'date') => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (DATE_ONLY_PATTERN.test(trimmed)) {
      return trimmed;
    }

    const utcMidnightDate = trimmed.match(UTC_MIDNIGHT_DATE_PATTERN);
    if (utcMidnightDate) {
      return utcMidnightDate[1];
    }
  }

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw validationError(`Invalid ${fieldName}. Use YYYY-MM-DD.`);
  }

  return formatLocalDateOnly(parsed);
};

export const normalizeTimeOnly = (value, fieldName = 'time') => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const match = String(value).trim().match(TIME_ONLY_PATTERN);
  if (!match) {
    throw validationError(`Invalid ${fieldName}. Use HH:mm.`);
  }

  return `${pad(match[1])}:${match[2]}`;
};
