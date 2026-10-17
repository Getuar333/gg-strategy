const timeToMinuteOfDay = (value: string): number => {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) throw new Error('Enter a valid start and end time.');

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) throw new Error('Enter a valid start and end time.');
  return hours * 60 + minutes;
};

const dateToUtcMinute = (date: string, time: number): number => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) throw new Error('Enter valid start and end dates.');

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const normalized = new Date(Date.UTC(year, month - 1, day));
  if (normalized.getUTCFullYear() !== year || normalized.getUTCMonth() !== month - 1 || normalized.getUTCDate() !== day) {
    throw new Error('Enter valid start and end dates.');
  }

  return Math.floor(Date.UTC(year, month - 1, day) / 60000) + time;
};

export const calculateDurationMinutes = (
  startTime: string,
  endTime: string,
  startDate = '',
  endDate = '',
): number => {
  const startMinuteOfDay = timeToMinuteOfDay(startTime);
  const endMinuteOfDay = timeToMinuteOfDay(endTime);

  if (Boolean(startDate) !== Boolean(endDate)) {
    throw new Error('Enter both dates, or leave both dates empty.');
  }

  if (startDate && endDate) {
    const start = dateToUtcMinute(startDate, startMinuteOfDay);
    const end = dateToUtcMinute(endDate, endMinuteOfDay);
    if (end < start) throw new Error('The end date and time must be after the start.');
    return end - start;
  }

  return endMinuteOfDay >= startMinuteOfDay
    ? endMinuteOfDay - startMinuteOfDay
    : endMinuteOfDay + 1440 - startMinuteOfDay;
};
