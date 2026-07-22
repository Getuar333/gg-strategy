// ==================== DATE FORMATTING ====================
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const UTC_MIDNIGHT_DATE_PATTERN = /^(\d{4}-\d{2}-\d{2})T00:00:00(?:\.000)?Z$/;

const pad = (value: number): string => String(value).padStart(2, '0');

export const toDateOnly = (date: string | Date | null | undefined): string => {
  if (!date) return '';

  if (date instanceof Date) {
    if (Number.isNaN(date.getTime())) return '';

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  const trimmed = date.trim();
  if (DATE_ONLY_PATTERN.test(trimmed)) {
    return trimmed;
  }

  const utcMidnightDate = trimmed.match(UTC_MIDNIGHT_DATE_PATTERN);
  if (utcMidnightDate) {
    return utcMidnightDate[1];
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
};

export const getTodayDateOnly = (): string => toDateOnly(new Date());

export const parseDateOnly = (date: string | null | undefined): Date | null => {
  const normalized = toDateOnly(date);
  if (!normalized) {
    return null;
  }

  const [year, month, day] = normalized.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatDate = (date: string | Date | null | undefined): string => {
  return toDateOnly(date) || 'Invalid date';
};

export const formatDisplayDate = (date: string | Date | null | undefined): string => {
  const parsed = date instanceof Date ? date : parseDateOnly(date);
  if (!parsed || Number.isNaN(parsed.getTime())) return 'No date';

  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric' }).format(parsed);
};

// ==================== TIME FORMATTING ====================
export const formatTime = (time: string | null | undefined): string => {
  if (!time) return '--:--';
  
  try {
    // If time is HH:mm format, return as is
    if (time.match(/^\d{2}:\d{2}$/)) {
      return time;
    }
    
    // If time is ISO string, extract time part
    const match = time.match(/\d{2}:\d{2}/);
    return match ? match[0] : '--:--';
  } catch {
    return '--:--';
  }
};

// ==================== TIME VALIDATION ====================
export const isEndTimeValid = (startTime: string, endTime: string): boolean => {
  if (!startTime || !endTime) return true;
  
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startTotal = startHour * 60 + startMin;
  const endTotal = endHour * 60 + endMin;
  
  return endTotal > startTotal;
};

// ==================== PREDEFINED CATEGORIES ====================
export const TASK_CATEGORIES = [
  { value: 'meeting', label: 'Meeting' },
  { value: 'lesson', label: 'Mësim' },
  { value: 'lecture', label: 'Ligjëratë' },
  { value: 'exam', label: 'Provim' },
  { value: 'dite_pushimi', label: 'Ditë pushimi' },
] as const;

export type TaskCategory = typeof TASK_CATEGORIES[number]['value'];

export const getCategoryLabel = (category: string): string => {
  const found = TASK_CATEGORIES.find((c) => c.value === category);
  return found?.label || category;
};
