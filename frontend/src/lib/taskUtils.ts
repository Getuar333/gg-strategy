// ==================== DATE FORMATTING ====================
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return 'No date';
  
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return 'Invalid date';
    
    // Format as YYYY-MM-DD
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch {
    return 'Invalid date';
  }
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
  { value: 'lesson', label: 'Lesson' },
  { value: 'lecture', label: 'Lecture' },
  { value: 'exam', label: 'Exam' },
] as const;

export type TaskCategory = typeof TASK_CATEGORIES[number]['value'];

export const getCategoryLabel = (category: string): string => {
  const found = TASK_CATEGORIES.find((c) => c.value === category);
  return found?.label || category;
};
