import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiArrowDown, FiBell, FiBriefcase, FiCalendar, FiClock, FiCoffee, FiRefreshCw } from 'react-icons/fi';
import { calculateDurationMinutes } from '../lib/timeCalculator';

type ScheduleKey = 'work' | 'break';
type FocusSchedule = {
  id: string;
  startAt: number;
  endAt: number;
  active: boolean;
  reminderSent: boolean;
  completedSent: boolean;
};
type ScheduleMap = Record<ScheduleKey, FocusSchedule | null>;
type ScheduleDraft = { date: string; start: string; end: string };
type ScheduleNotice = { id: string; text: string };

const scheduleStorageKey = 'clock-studio-schedules-v1';
const scheduleKeys: ScheduleKey[] = ['work', 'break'];
const scheduleTitles: Record<ScheduleKey, string> = { work: 'Work time', break: 'Break time' };

const localDateValue = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const makeScheduleDrafts = (): Record<ScheduleKey, ScheduleDraft> => {
  const today = localDateValue(new Date());
  return {
    work: { date: today, start: '', end: '' },
    break: { date: today, start: '', end: '' },
  };
};

const loadSchedules = (): ScheduleMap => {
  const empty: ScheduleMap = { work: null, break: null };

  try {
    const stored = window.localStorage.getItem(scheduleStorageKey);
    if (!stored) return empty;

    const parsed = JSON.parse(stored) as Partial<ScheduleMap>;
    return scheduleKeys.reduce<ScheduleMap>((schedules, key) => {
      const candidate = parsed[key];
      if (!candidate || typeof candidate !== 'object' || !Number.isFinite(candidate.startAt) || !Number.isFinite(candidate.endAt) || candidate.endAt <= candidate.startAt) {
        schedules[key] = null;
        return schedules;
      }

      const hasExpired = candidate.endAt <= Date.now();
      schedules[key] = {
        ...candidate,
        active: hasExpired ? false : Boolean(candidate.active),
        reminderSent: Boolean(candidate.reminderSent),
        completedSent: hasExpired ? true : Boolean(candidate.completedSent),
      };
      return schedules;
    }, empty);
  } catch {
    return empty;
  }
};

const createLocalDateTime = (dateValue: string, timeValue: string): Date => {
  const [year, month, day] = dateValue.split('-').map(Number);
  const [hours, minutes] = timeValue.split(':').map(Number);
  const result = new Date(year, month - 1, day, hours, minutes, 0, 0);
  if (!dateValue || !timeValue || Number.isNaN(result.getTime()) || result.getFullYear() !== year || result.getMonth() !== month - 1 || result.getDate() !== day || result.getHours() !== hours || result.getMinutes() !== minutes) {
    throw new Error('Choose a valid date and time.');
  }
  return result;
};

const formatCountdown = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours) return `${hours}h ${minutes}m`;
  if (minutes) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

const formatScheduleDateTime = (timestamp: number) => new Date(timestamp).toLocaleString(undefined, {
  weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
});

const getScheduleStatus = (schedule: FocusSchedule | null, currentTime: number) => {
  if (!schedule) return { label: 'Not scheduled', detail: 'Choose a date and time to create a plan.', variant: 'idle' };
  if (!schedule.active) {
    return schedule.endAt <= currentTime
      ? { label: 'Completed', detail: 'This schedule has finished.', variant: 'complete' }
      : { label: 'Stopped', detail: 'This schedule is saved but inactive.', variant: 'idle' };
  }
  if (currentTime < schedule.startAt) {
    return { label: 'Scheduled', detail: `Starts in ${formatCountdown(schedule.startAt - currentTime)}.`, variant: 'upcoming' };
  }
  if (currentTime >= schedule.endAt) return { label: 'Completed', detail: 'This schedule has finished.', variant: 'complete' };
  const timeLeft = schedule.endAt - currentTime;
  if (schedule.reminderSent || timeLeft <= 8 * 60 * 1000) {
    return { label: 'Ending soon', detail: `${formatCountdown(timeLeft)} remaining.`, variant: 'ending' };
  }
  return { label: 'In progress', detail: `${formatCountdown(timeLeft)} remaining.`, variant: 'running' };
};

type ClockDesignId =
  | 'classic-analog'
  | 'minimal-analog'
  | 'luxury-analog'
  | 'digital-led'
  | 'modern-digital'
  | 'futuristic-neon'
  | 'dark-clock'
  | 'light-clock';

type ClockDesign = { id: ClockDesignId; title: string; description: string; mode: 'analog' | 'digital'; tone: 'dark' | 'light' };

const designs: ClockDesign[] = [
  { id: 'classic-analog', title: 'Classic Analog', description: 'Traditional face with clear numerals.', mode: 'analog', tone: 'dark' },
  { id: 'minimal-analog', title: 'Minimal Analog', description: 'Quiet markers and a clean dial.', mode: 'analog', tone: 'light' },
  { id: 'luxury-analog', title: 'Luxury Analog', description: 'A refined dial with a polished edge.', mode: 'analog', tone: 'dark' },
  { id: 'digital-led', title: 'Digital LED', description: 'Bright segmented-style time display.', mode: 'digital', tone: 'dark' },
  { id: 'modern-digital', title: 'Modern Digital', description: 'A simple, precise digital readout.', mode: 'digital', tone: 'light' },
  { id: 'futuristic-neon', title: 'Futuristic Neon', description: 'Electric color and soft ambient glow.', mode: 'digital', tone: 'dark' },
  { id: 'dark-clock', title: 'Dark Clock', description: 'Low-glare timekeeping for dark rooms.', mode: 'digital', tone: 'dark' },
  { id: 'light-clock', title: 'Light Clock', description: 'A clear light-theme display.', mode: 'digital', tone: 'light' },
];

const pad = (value: number) => String(value).padStart(2, '0');

const ClockStudioPage: React.FC = () => {
  const [now, setNow] = useState(() => new Date());
  const [designId, setDesignId] = useState<ClockDesignId>('classic-analog');
  const [clockFormat, setClockFormat] = useState<'12' | '24'>('24');
  const [showSeconds, setShowSeconds] = useState(true);
  const [accent, setAccent] = useState('#8B5CF6');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('14:00');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState<number | null>(null);
  const [calculatorError, setCalculatorError] = useState('');
  const [scheduleDrafts, setScheduleDrafts] = useState(() => makeScheduleDrafts());
  const [schedules, setSchedules] = useState<ScheduleMap>(() => loadSchedules());
  const [scheduleErrors, setScheduleErrors] = useState<Record<ScheduleKey, string>>({ work: '', break: '' });
  const [scheduleNotice, setScheduleNotice] = useState<ScheduleNotice | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const firedScheduleEvents = useRef(new Set<string>());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 250);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(scheduleStorageKey, JSON.stringify(schedules));
    } catch {
      // Keep the in-memory schedule usable if browser storage is unavailable.
    }
  }, [schedules]);

  const playScheduleSound = useCallback((type: 'reminder' | 'complete') => {
    const context = audioContextRef.current;
    if (!context) return;

    const play = () => {
      const oscillator = context.createOscillator();
      const volume = context.createGain();
      const startAt = context.currentTime;
      const warning = type === 'reminder';

      oscillator.type = warning ? 'sawtooth' : 'sine';
      oscillator.frequency.setValueAtTime(warning ? 190 : 560, startAt);
      oscillator.frequency.exponentialRampToValueAtTime(warning ? 82 : 720, startAt + 0.42);
      volume.gain.setValueAtTime(0.0001, startAt);
      volume.gain.exponentialRampToValueAtTime(0.13, startAt + 0.035);
      volume.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.52);
      oscillator.connect(volume);
      volume.connect(context.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + 0.54);
    };

    if (context.state === 'suspended') {
      void context.resume().then(play).catch(() => undefined);
    } else {
      play();
    }
  }, []);

  useEffect(() => {
    const currentTime = now.getTime();
    const updatedSchedules = { ...schedules };
    let changed = false;

    scheduleKeys.forEach((key) => {
      const schedule = schedules[key];
      if (!schedule?.active) return;

      if (currentTime >= schedule.endAt) {
        if (!schedule.completedSent) {
          const eventId = `${schedule.id}:complete`;
          if (!firedScheduleEvents.current.has(eventId)) {
            firedScheduleEvents.current.add(eventId);
            setScheduleNotice({ id: eventId, text: `${scheduleTitles[key]} has ended.` });
            playScheduleSound('complete');
          }
        }
        updatedSchedules[key] = { ...schedule, active: false, completedSent: true };
        changed = true;
        return;
      }

      const reminderAt = Math.max(schedule.startAt, schedule.endAt - 8 * 60 * 1000);
      if (currentTime >= reminderAt && !schedule.reminderSent) {
        const eventId = `${schedule.id}:reminder`;
        if (!firedScheduleEvents.current.has(eventId)) {
          firedScheduleEvents.current.add(eventId);
          const minutesLeft = Math.max(1, Math.ceil((schedule.endAt - currentTime) / 60000));
          setScheduleNotice({ id: eventId, text: `${scheduleTitles[key]} ends in about ${minutesLeft} minute${minutesLeft === 1 ? '' : 's'}.` });
          playScheduleSound('reminder');
        }
        updatedSchedules[key] = { ...schedule, reminderSent: true };
        changed = true;
      }
    });

    if (changed) setSchedules(updatedSchedules);
  }, [now, playScheduleSound, schedules]);

  useEffect(() => {
    if (!scheduleNotice) return undefined;
    const timer = window.setTimeout(() => {
      setScheduleNotice((current) => current?.id === scheduleNotice.id ? null : current);
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [scheduleNotice]);

  const activateSchedule = (key: ScheduleKey, event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setScheduleErrors((current) => ({ ...current, [key]: '' }));

    try {
      const draft = scheduleDrafts[key];
      const start = createLocalDateTime(draft.date, draft.start);
      const end = createLocalDateTime(draft.date, draft.end);
      if (start.getTime() === end.getTime()) throw new Error('Start and end times must be different.');
      if (end.getTime() < start.getTime()) end.setDate(end.getDate() + 1);
      if (end.getTime() <= Date.now()) throw new Error('The end time has already passed. Choose a future time.');

      const previous = schedules[key];
      if (previous) {
        firedScheduleEvents.current.delete(`${previous.id}:reminder`);
        firedScheduleEvents.current.delete(`${previous.id}:complete`);
      }

      const AudioContextConstructor = window.AudioContext;
      if (AudioContextConstructor && !audioContextRef.current) audioContextRef.current = new AudioContextConstructor();
      if (audioContextRef.current?.state === 'suspended') void audioContextRef.current.resume().catch(() => undefined);

      setSchedules((current) => ({
        ...current,
        [key]: {
          id: `${key}-${Date.now()}`,
          startAt: start.getTime(),
          endAt: end.getTime(),
          active: true,
          reminderSent: false,
          completedSent: false,
        },
      }));
    } catch (error) {
      setScheduleErrors((current) => ({
        ...current,
        [key]: error instanceof Error ? error.message : 'Enter a valid date and time.',
      }));
    }
  };

  const stopSchedule = (key: ScheduleKey) => {
    setSchedules((current) => current[key] ? { ...current, [key]: { ...current[key]!, active: false } } : current);
  };

  const clearSchedule = (key: ScheduleKey) => {
    setSchedules((current) => ({ ...current, [key]: null }));
    setScheduleErrors((current) => ({ ...current, [key]: '' }));
  };

  const updateScheduleDraft = (key: ScheduleKey, field: keyof ScheduleDraft, value: string) => {
    setScheduleDrafts((current) => ({ ...current, [key]: { ...current[key], [field]: value } }));
    setScheduleErrors((current) => ({ ...current, [key]: '' }));
  };

  const selectedDesign = designs.find((design) => design.id === designId) ?? designs[0];
  const hours24 = now.getHours();
  const hours12 = hours24 % 12 || 12;
  const hourText = pad(clockFormat === '12' ? hours12 : hours24);
  const minuteText = pad(now.getMinutes());
  const secondText = pad(now.getSeconds());
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const displayTime = `${hourText}:${minuteText}${showSeconds ? `:${secondText}` : ''}`;
  const hourAngle = ((hours24 % 12) + now.getMinutes() / 60) * 30;
  const minuteAngle = (now.getMinutes() + now.getSeconds() / 60) * 6;
  const secondAngle = (now.getSeconds() + now.getMilliseconds() / 1000) * 6;
  const isAnalog = selectedDesign.mode === 'analog';
  const style = { '--clock-accent': accent } as React.CSSProperties;

  const calculateDuration = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCalculatorError('');
    setDuration(null);

    try {
      setDuration(calculateDurationMinutes(startTime, endTime, startDate, endDate));
    } catch (error) {
      setCalculatorError(error instanceof Error ? error.message : 'Enter a valid time range.');
    }
  };

  const resetCalculator = () => {
    setStartTime('10:00');
    setEndTime('14:00');
    setStartDate('');
    setEndDate('');
    setDuration(null);
    setCalculatorError('');
  };

  const durationHours = duration === null ? 0 : Math.floor(duration / 60);
  const durationMinutes = duration === null ? 0 : duration % 60;

  return (
    <div className="feature-page clock-studio-page px-4 py-7 sm:px-6 lg:px-8">
      <header className="feature-heading mb-7">
        <div>
          <p className="feature-eyebrow"><FiClock /> Clock Studio</p>
          <h1>Time, your way</h1>
          <p className="feature-heading-copy">Explore live clock faces and calculate elapsed time.</p>
        </div>
      </header>

      <div className="clock-studio-layout">
        <section className={`clock-showcase clock-showcase--${designId} ${selectedDesign.tone === 'light' ? 'clock-showcase--light' : ''}`} style={style} aria-label="Live clock preview">
          <div className="clock-showcase-orbit clock-showcase-orbit--one" aria-hidden="true" />
          <div className="clock-showcase-orbit clock-showcase-orbit--two" aria-hidden="true" />
          <div className="clock-showcase-topline">
            <span className="clock-live-indicator"><i /> Live local time</span>
            <span className="clock-showcase-design">{selectedDesign.title}</span>
          </div>

          <div className="clock-showcase-center">
            {isAnalog ? (
              <div className="analog-clock" aria-label={`Current time ${displayTime}`}>
                <div className="analog-clock-face">
                  {Array.from({ length: 12 }, (_, index) => {
                    const angle = index * 30;
                    const label = index === 0 ? 12 : index;
                    return <span className="analog-clock-number" key={label} style={{ top: `${50 - Math.cos((angle * Math.PI) / 180) * 42}%`, left: `${50 + Math.sin((angle * Math.PI) / 180) * 42}%` }}>{label}</span>;
                  })}
                  {Array.from({ length: 60 }, (_, index) => <i className={`analog-clock-tick ${index % 5 === 0 ? 'is-major' : ''}`} key={index} style={{ transform: `translateX(-50%) rotate(${index * 6}deg)` }} />)}
                  <i className="analog-clock-hand analog-clock-hand--hour" style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }} />
                  <i className="analog-clock-hand analog-clock-hand--minute" style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }} />
                  {showSeconds && <i className="analog-clock-hand analog-clock-hand--second" style={{ transform: `translateX(-50%) rotate(${secondAngle}deg)` }} />}
                  <i className="analog-clock-pin" />
                </div>
              </div>
            ) : (
              <div className="digital-clock" aria-label={`Current time ${displayTime}${clockFormat === '12' ? ` ${period}` : ''}`}>
                <p className="digital-clock-label">Current time</p>
                <p className="digital-clock-time"><span>{hourText}:{minuteText}</span>{showSeconds && <small>:{secondText}</small>}{clockFormat === '12' && <em>{period}</em>}</p>
                <p className="digital-clock-date">{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            )}
          </div>

          <div className="clock-showcase-footer">
            <div><span>Today</span><strong>{now.toLocaleDateString('en-US', { weekday: 'long' })}</strong></div>
            <div><span>Date</span><strong>{now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></div>
            <div><span>Format</span><strong>{clockFormat}-hour</strong></div>
          </div>
        </section>

        <section className="clock-controls-card" aria-label="Clock settings">
          <div className="clock-section-title">
            <div><p className="feature-eyebrow">Personalize</p><h2>Clock settings</h2></div>
            <FiClock />
          </div>

          <div className="clock-setting-row">
            <div><strong>Time format</strong><span>Choose how hours appear</span></div>
            <div className="clock-option-switch" role="group" aria-label="Time format">
              <button type="button" onClick={() => setClockFormat('12')} aria-pressed={clockFormat === '12'} className={clockFormat === '12' ? 'is-selected' : ''}>12h</button>
              <button type="button" onClick={() => setClockFormat('24')} aria-pressed={clockFormat === '24'} className={clockFormat === '24' ? 'is-selected' : ''}>24h</button>
            </div>
          </div>

          <div className="clock-setting-row">
            <div><strong>Show seconds</strong><span>Keep the display precise</span></div>
            <button type="button" role="switch" aria-checked={showSeconds} aria-label="Show seconds" onClick={() => setShowSeconds((value) => !value)} className={`clock-toggle ${showSeconds ? 'is-on' : ''}`}><i /></button>
          </div>

          <label className="clock-color-row">
            <span><strong>Accent color</strong><small>Adjust the clock highlights</small></span>
            <span className="clock-color-input-wrap"><input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} aria-label="Accent color" /><span>{accent.toUpperCase()}</span></span>
          </label>

          <div className="clock-time-note"><FiClock /><span>Your clock follows the current time on this device.</span></div>
        </section>
      </div>

      <section className="focus-planner-section" aria-labelledby="focus-planner-title">
        <div className="focus-planner-heading">
          <div>
            <p className="feature-eyebrow"><FiCalendar /> Time planning</p>
            <h2 id="focus-planner-title">Work time &amp; break time</h2>
            <p>Set an exact date and time for each period. You will be alerted 8 minutes before it ends and when it finishes.</p>
          </div>
        </div>

        {scheduleNotice && <div className="focus-planner-notice" role="alert" aria-live="assertive"><FiBell /><span>{scheduleNotice.text}</span></div>}

        <div className="focus-planner-grid">
          {scheduleKeys.map((key) => {
            const isWork = key === 'work';
            const schedule = schedules[key];
            const draft = scheduleDrafts[key];
            const status = getScheduleStatus(schedule, now.getTime());

            return (
              <article className={`focus-plan-card focus-plan-card--${key}`} key={key}>
                <div className="focus-plan-card-heading">
                  <span className="focus-plan-icon">{isWork ? <FiBriefcase /> : <FiCoffee />}</span>
                  <div><p>{isWork ? 'Focus session' : 'Rest session'}</p><h3>{scheduleTitles[key]}</h3></div>
                  <span className={`focus-plan-badge focus-plan-badge--${status.variant}`}>{status.label}</span>
                </div>

                <form className="focus-plan-form" onSubmit={(event) => activateSchedule(key, event)}>
                  <label className="time-input-group">
                    <span>Date</span>
                    <input type="date" required value={draft.date} onChange={(event) => updateScheduleDraft(key, 'date', event.target.value)} className="feature-input" />
                  </label>
                  <div className="focus-plan-time-fields">
                    <label className="time-input-group">
                      <span>Start time</span>
                      <input type="time" required value={draft.start} onChange={(event) => updateScheduleDraft(key, 'start', event.target.value)} className="feature-input" />
                    </label>
                    <label className="time-input-group">
                      <span>End time</span>
                      <input type="time" required value={draft.end} onChange={(event) => updateScheduleDraft(key, 'end', event.target.value)} className="feature-input" />
                    </label>
                  </div>
                  <p className="focus-plan-hint">Uses your device's local time. If the end time is earlier, the period ends the next day.</p>
                  {scheduleErrors[key] && <p className="time-calculator-error" role="alert">{scheduleErrors[key]}</p>}

                  <div className="focus-plan-actions">
                    <button type="submit" className="feature-button">{schedule?.active ? 'Update schedule' : 'Save & activate'}</button>
                    {schedule?.active && <button type="button" onClick={() => stopSchedule(key)} className="feature-button feature-button--quiet">Stop</button>}
                    {schedule && <button type="button" onClick={() => clearSchedule(key)} className="feature-button feature-button--quiet">Clear</button>}
                  </div>
                </form>

                {schedule && (
                  <div className="focus-plan-summary">
                    <div><span>Starts</span><strong>{formatScheduleDateTime(schedule.startAt)}</strong></div>
                    <div><span>Ends</span><strong>{formatScheduleDateTime(schedule.endAt)}</strong></div>
                    <p className={`focus-plan-detail focus-plan-detail--${status.variant}`} role="status">{status.detail}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
        <p className="focus-planner-note"><FiClock /> Plans are saved on this device. Keep Clock Studio open to receive the timed alerts and sounds.</p>
      </section>

      <section className="clock-gallery-section">
        <div className="clock-section-title clock-gallery-heading">
          <div><p className="feature-eyebrow">Choose a look</p><h2>Clock gallery</h2><p>Each design uses the live local time.</p></div>
        </div>
        <div className="clock-gallery-grid">
          {designs.map((design) => (
            <article className={`clock-design-card ${designId === design.id ? 'is-selected' : ''}`} key={design.id}>
              <div className={`clock-design-preview clock-design-preview--${design.id}`} aria-hidden="true">
                {design.mode === 'analog' ? <span className="clock-preview-dial"><i /><i /></span> : <span className="clock-preview-digital">10:09<small>:{showSeconds ? '45' : '••'}</small></span>}
              </div>
              <div className="clock-design-copy"><h3>{design.title}</h3><p>{design.description}</p></div>
              <button type="button" onClick={() => setDesignId(design.id)} className="clock-select-button" aria-pressed={designId === design.id}>{designId === design.id ? 'Selected' : 'Select design'}</button>
            </article>
          ))}
        </div>
      </section>

      <section className="time-calculator-section" aria-labelledby="time-calculator-title">
        <div className="time-calculator-intro">
          <p className="feature-eyebrow"><FiArrowDown /> Time calculator</p>
          <h2 id="time-calculator-title">Calculate elapsed time</h2>
          <p>Compare two times, or add dates to include multiple days.</p>
        </div>
        <form className="time-calculator-form" onSubmit={calculateDuration}>
          <div className="time-calculator-fields">
            <label className="time-input-group"><span>Start time</span><input type="time" required value={startTime} onChange={(event) => setStartTime(event.target.value)} className="feature-input" /></label>
            <label className="time-input-group"><span>End time</span><input type="time" required value={endTime} onChange={(event) => setEndTime(event.target.value)} className="feature-input" /></label>
            <label className="time-input-group"><span>Start date <small>Optional</small></span><span className="time-date-input"><FiCalendar /><input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></span></label>
            <label className="time-input-group"><span>End date <small>Optional</small></span><span className="time-date-input"><FiCalendar /><input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></span></label>
          </div>
          <div className="time-calculator-actions">
            <button type="submit" className="feature-button">Calculate time</button>
            <button type="button" onClick={resetCalculator} className="feature-button feature-button--quiet"><FiRefreshCw /> Reset</button>
          </div>
          {calculatorError && <p className="time-calculator-error" role="alert">{calculatorError}</p>}
          {duration !== null && (
            <div className="time-calculator-result" role="status">
              <span className="time-result-label">Elapsed time</span>
              <strong>{durationHours ? `${durationHours} ${durationHours === 1 ? 'hour' : 'hours'}` : ''}{durationHours && durationMinutes ? ' ' : ''}{durationMinutes || !durationHours ? `${durationMinutes} ${durationMinutes === 1 ? 'minute' : 'minutes'}` : ''}</strong>
              <span>{duration.toLocaleString()} total minutes</span>
            </div>
          )}
        </form>
      </section>
    </div>
  );
};

export default ClockStudioPage;
