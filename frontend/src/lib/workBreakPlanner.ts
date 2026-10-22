export type PlannerNoticeType = 'warning' | 'complete';

export type WorkBreakSchedule = {
  id: string;
  day: string;
  start: string;
  end: string;
  warningSent: boolean;
};

export type WorkBreakTiming = {
  startAt: number;
  warningAt: number;
  endAt: number;
  durationMinutes: number;
};

const parseTime = (value: string): number => {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) throw new Error('Vendosni një orë të vlefshme.');

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) throw new Error('Vendosni një orë të vlefshme.');
  return hours * 60 + minutes;
};

export const calculateWorkBreakDuration = (start: string, end: string): number => {
  const startMinutes = parseTime(start);
  const endMinutes = parseTime(end);
  if (endMinutes <= startMinutes) {
    throw new Error('Ora e përfundimit duhet të jetë pas orës së fillimit gjatë së njëjtës ditë.');
  }
  return endMinutes - startMinutes;
};

export const localDayKey = (date: Date): string => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const getWorkBreakTiming = (
  day: string,
  start: string,
  end: string,
): WorkBreakTiming => {
  const durationMinutes = calculateWorkBreakDuration(start, end);
  const dayMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if (!dayMatch) throw new Error('Data e planit nuk është e vlefshme.');

  const year = Number(dayMatch[1]);
  const month = Number(dayMatch[2]);
  const date = Number(dayMatch[3]);
  const startMinutes = parseTime(start);
  const endMinutes = parseTime(end);
  const startAt = new Date(year, month - 1, date, Math.floor(startMinutes / 60), startMinutes % 60).getTime();
  const endAt = new Date(year, month - 1, date, Math.floor(endMinutes / 60), endMinutes % 60).getTime();
  const startDate = new Date(startAt);
  const endDate = new Date(endAt);

  if (
    startDate.getFullYear() !== year || startDate.getMonth() !== month - 1 || startDate.getDate() !== date
    || endDate.getFullYear() !== year || endDate.getMonth() !== month - 1 || endDate.getDate() !== date
  ) {
    throw new Error('Ora e planifikuar nuk ekziston në orën lokale të kësaj date.');
  }

  return { startAt, warningAt: endAt - 8 * 60 * 1000, endAt, durationMinutes };
};

type TimerClock = { now(): number };
type TimerFunctions = Pick<typeof globalThis, 'setTimeout' | 'clearTimeout'>;

export const scheduleAt = (
  deadline: number,
  callback: () => void,
  clock: TimerClock = Date,
  timers: TimerFunctions = globalThis,
): (() => void) => {
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const arm = () => {
    if (cancelled) return;
    const remaining = deadline - clock.now();
    if (remaining <= 0) {
      callback();
      return;
    }
    timer = timers.setTimeout(arm, Math.min(remaining, 2_147_000_000));
  };

  arm();
  return () => {
    cancelled = true;
    if (timer !== undefined) timers.clearTimeout(timer);
  };
};

export const scheduleWorkBreakNotifications = (
  schedule: WorkBreakSchedule,
  callbacks: { onWarning: () => void; onComplete: () => void },
  clock: TimerClock = Date,
  timers: TimerFunctions = globalThis,
): { cancel: () => void; warningSkipped: boolean; alreadyEnded: boolean } => {
  const timing = getWorkBreakTiming(schedule.day, schedule.start, schedule.end);
  const now = clock.now();
  if (timing.endAt <= now) {
    return { cancel: () => {}, warningSkipped: false, alreadyEnded: true };
  }

  const cancellations: Array<() => void> = [];
  const warningSkipped = !schedule.warningSent && timing.warningAt <= now;
  if (!schedule.warningSent && !warningSkipped) {
    cancellations.push(scheduleAt(timing.warningAt, callbacks.onWarning, clock, timers));
  }
  cancellations.push(scheduleAt(timing.endAt, callbacks.onComplete, clock, timers));
  return {
    cancel: () => cancellations.forEach((cancel) => cancel()),
    warningSkipped,
    alreadyEnded: false,
  };
};

type ToneContext = Pick<AudioContext, 'currentTime' | 'destination' | 'createOscillator' | 'createGain'>;

export const playWorkBreakTone = (context: ToneContext, type: PlannerNoticeType): void => {
  const playNote = (frequency: number, startAt: number, duration: number, slideTo?: number) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type === 'warning' ? 'triangle' : 'sine';
    oscillator.frequency.setValueAtTime(frequency, startAt);
    if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(slideTo, startAt + duration * 0.75);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(0.12, startAt + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.01);
  };

  const now = context.currentTime + 0.02;
  if (type === 'warning') {
    playNote(470, now, 0.34, 205);
    return;
  }

  playNote(660, now, 0.22);
  playNote(880, now + 0.2, 0.3);
};
