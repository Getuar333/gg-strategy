import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiClock, FiVolume2, FiVolumeX } from 'react-icons/fi';
import {
  calculateWorkBreakDuration,
  getWorkBreakTiming,
  localDayKey,
  playWorkBreakTone,
  PlannerNoticeType,
  scheduleWorkBreakNotifications,
  WorkBreakSchedule,
} from '../lib/workBreakPlanner';

type PlannerSlot = 'work' | 'break';
type PlannerNotice = { type: PlannerNoticeType; message: string };
type PlannerValues = { start: string; end: string };

const storageKey = (slot: PlannerSlot) => `clock-studio-${slot}-schedule-v1`;

const readSchedule = (slot: PlannerSlot): WorkBreakSchedule | null => {
  if (typeof window === 'undefined') return null;
  try {
    const serialized = window.localStorage.getItem(storageKey(slot));
    if (!serialized) return null;
    const value = JSON.parse(serialized) as Partial<WorkBreakSchedule>;
    if (
      typeof value.id !== 'string' || typeof value.day !== 'string'
      || typeof value.start !== 'string' || typeof value.end !== 'string'
      || typeof value.warningSent !== 'boolean'
    ) return null;
    getWorkBreakTiming(value.day, value.start, value.end);
    return value as WorkBreakSchedule;
  } catch {
    return null;
  }
};

const persistSchedule = (slot: PlannerSlot, schedule: WorkBreakSchedule | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (schedule) window.localStorage.setItem(storageKey(slot), JSON.stringify(schedule));
    else window.localStorage.removeItem(storageKey(slot));
  } catch {
    // The planner still works for this page session when browser storage is unavailable.
  }
};

const noticeMessage = (slot: PlannerSlot, type: PlannerNoticeType) => {
  if (slot === 'work') {
    return type === 'warning'
      ? 'Kanë mbetur edhe 8 minuta deri në përfundimin e kohës së punës!'
      : 'Koha e punës ka përfunduar!';
  }
  return type === 'warning'
    ? 'Kanë mbetur edhe 8 minuta deri në përfundimin e pauzës!'
    : "Pauza ka përfunduar! Koha për t'u kthyer në punë.";
};

const describeDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours && rest) return `${hours} orë ${rest} min`;
  if (hours) return `${hours} orë`;
  return `${rest} min`;
};

type PlannerCardProps = {
  slot: PlannerSlot;
  title: string;
  values: PlannerValues;
  duration: number | null;
  plan: WorkBreakSchedule | null;
  notice: PlannerNotice | null;
  error: string;
  onTimeChange: (slot: PlannerSlot, field: keyof PlannerValues, value: string) => void;
  onActivate: (slot: PlannerSlot) => void;
  onStop: (slot: PlannerSlot) => void;
  onDismissNotice: (slot: PlannerSlot) => void;
};

const PlannerCard: React.FC<PlannerCardProps> = ({
  slot, title, values, duration, plan, notice, error,
  onTimeChange, onActivate, onStop, onDismissNotice,
}) => (
  <article className="work-break-card" aria-labelledby={`${slot}-planner-title`}>
    <div className="work-break-card-heading">
      <div>
        <p className="feature-eyebrow">{slot === 'work' ? 'Work time' : 'Break time'}</p>
        <h3 id={`${slot}-planner-title`}>{title}</h3>
      </div>
      <FiClock aria-hidden="true" />
    </div>

    <div className="work-break-fields">
      <label className="time-input-group">
        <span>Ora e fillimit</span>
        <input
          type="time"
          required
          value={values.start}
          onChange={(event) => onTimeChange(slot, 'start', event.target.value)}
          className="feature-input"
          aria-label={`${title}: ora e fillimit`}
        />
      </label>
      <label className="time-input-group">
        <span>Ora e përfundimit</span>
        <input
          type="time"
          required
          value={values.end}
          onChange={(event) => onTimeChange(slot, 'end', event.target.value)}
          className="feature-input"
          aria-label={`${title}: ora e përfundimit`}
        />
      </label>
    </div>

    <div className="work-break-duration" aria-live="polite">
      <span>Kohëzgjatja totale</span>
      <strong>{duration === null ? '—' : describeDuration(duration)}</strong>
    </div>

    {plan && <p className="work-break-active" role="status">Plani është aktiv për sot, deri në orën {plan.end}.</p>}
    {error && <p className="work-break-error" role="alert">{error}</p>}
    {notice && (
      <div className={`work-break-notice work-break-notice--${notice.type}`} role="status" aria-live="assertive">
        <span>{notice.message}</span>
        <button type="button" onClick={() => onDismissNotice(slot)} aria-label={`Mbyll njoftimin: ${title}`}>Mbyll</button>
      </div>
    )}

    <div className="work-break-actions">
      <button type="button" className="feature-button" onClick={() => onActivate(slot)}>
        {plan ? 'Përditëso planin' : 'Aktivizo planin'}
      </button>
      {plan && <button type="button" className="feature-button feature-button--quiet" onClick={() => onStop(slot)}>Ndalo planin</button>}
    </div>
  </article>
);

const WorkBreakPlanner: React.FC = () => {
  const [workValues, setWorkValues] = useState<PlannerValues>(() => {
    const saved = readSchedule('work');
    return saved ? { start: saved.start, end: saved.end } : { start: '09:00', end: '17:00' };
  });
  const [breakValues, setBreakValues] = useState<PlannerValues>(() => {
    const saved = readSchedule('break');
    return saved ? { start: saved.start, end: saved.end } : { start: '12:00', end: '12:30' };
  });
  const [workPlan, setWorkPlan] = useState<WorkBreakSchedule | null>(() => readSchedule('work'));
  const [breakPlan, setBreakPlan] = useState<WorkBreakSchedule | null>(() => readSchedule('break'));
  const [workNotice, setWorkNotice] = useState<PlannerNotice | null>(null);
  const [breakNotice, setBreakNotice] = useState<PlannerNotice | null>(null);
  const [workError, setWorkError] = useState('');
  const [breakError, setBreakError] = useState('');
  const [soundsEnabled, setSoundsEnabled] = useState(false);
  const [soundError, setSoundError] = useState('');
  const workPlanRef = useRef(workPlan);
  const breakPlanRef = useRef(breakPlan);
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundEnabledRef = useRef(false);

  workPlanRef.current = workPlan;
  breakPlanRef.current = breakPlan;

  const updatePlan = useCallback((slot: PlannerSlot, nextPlan: WorkBreakSchedule | null) => {
    persistSchedule(slot, nextPlan);
    if (slot === 'work') setWorkPlan(nextPlan);
    else setBreakPlan(nextPlan);
  }, []);

  const playSound = useCallback((type: PlannerNoticeType) => {
    const context = audioContextRef.current;
    if (!soundEnabledRef.current || !context || context.state !== 'running') return;
    try {
      playWorkBreakTone(context, type);
    } catch {
      setSoundError('Tingulli nuk mund të luhet nga shfletuesi. Aktivizojeni përsëri tingullin.');
    }
  }, []);

  const setNotice = useCallback((slot: PlannerSlot, type: PlannerNoticeType) => {
    const notice = { type, message: noticeMessage(slot, type) };
    if (slot === 'work') setWorkNotice(notice);
    else setBreakNotice(notice);
    playSound(type);
  }, [playSound]);

  const makeSchedule = (start: string, end: string): WorkBreakSchedule => {
    const now = new Date();
    const day = localDayKey(now);
    const timing = getWorkBreakTiming(day, start, end);
    if (timing.endAt <= now.getTime()) {
      throw new Error('Ora e përfundimit për sot ka kaluar. Zgjidhni një orar që përfundon më vonë.');
    }
    return {
      id: `${day}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      day,
      start,
      end,
      warningSent: timing.warningAt <= now.getTime(),
    };
  };

  const handleTimeChange = (slot: PlannerSlot, field: keyof PlannerValues, value: string) => {
    const values = slot === 'work' ? workValues : breakValues;
    const activePlan = slot === 'work' ? workPlanRef.current : breakPlanRef.current;
    const nextValues = { ...values, [field]: value };
    if (slot === 'work') {
      setWorkValues(nextValues);
      setWorkError('');
    } else {
      setBreakValues(nextValues);
      setBreakError('');
    }

    if (!activePlan) return;
    try {
      updatePlan(slot, makeSchedule(nextValues.start, nextValues.end));
    } catch (error) {
      updatePlan(slot, null);
      const message = error instanceof Error ? error.message : 'Kontrolloni orarin e zgjedhur.';
      if (slot === 'work') setWorkError(message);
      else setBreakError(message);
    }
  };

  const activatePlan = (slot: PlannerSlot) => {
    const values = slot === 'work' ? workValues : breakValues;
    try {
      const schedule = makeSchedule(values.start, values.end);
      updatePlan(slot, schedule);
      if (slot === 'work') {
        setWorkError('');
        setWorkNotice(null);
      } else {
        setBreakError('');
        setBreakNotice(null);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Kontrolloni orarin e zgjedhur.';
      if (slot === 'work') setWorkError(message);
      else setBreakError(message);
    }
  };

  const stopPlan = (slot: PlannerSlot) => {
    updatePlan(slot, null);
    if (slot === 'work') {
      setWorkError('');
      setWorkNotice(null);
    } else {
      setBreakError('');
      setBreakNotice(null);
    }
  };

  const toggleSounds = async () => {
    if (soundEnabledRef.current) {
      soundEnabledRef.current = false;
      setSoundsEnabled(false);
      return;
    }
    try {
      const context = audioContextRef.current ?? new window.AudioContext();
      audioContextRef.current = context;
      await context.resume();
      if (context.state !== 'running') throw new Error('Audio could not be started.');
      soundEnabledRef.current = true;
      setSoundsEnabled(true);
      setSoundError('');
      playWorkBreakTone(context, 'warning');
    } catch {
      soundEnabledRef.current = false;
      setSoundsEnabled(false);
      setSoundError('Shfletuesi nuk mund ta aktivizojë audion. Kontrolloni cilësimet e zërit dhe provoni përsëri.');
    }
  };

  useEffect(() => {
    const timers: Array<() => void> = [];
    const fired = new Set<string>();

    const schedulePlan = (slot: PlannerSlot, initialPlan: WorkBreakSchedule | null) => {
      if (!initialPlan) return;
      const planRef = slot === 'work' ? workPlanRef : breakPlanRef;
      const currentPlan = planRef.current;
      if (!currentPlan || currentPlan.id !== initialPlan.id) return;

      if (initialPlan.day !== localDayKey(new Date())) {
        updatePlan(slot, null);
        return;
      }

      let scheduled: ReturnType<typeof scheduleWorkBreakNotifications>;
      try {
        scheduled = scheduleWorkBreakNotifications(initialPlan, {
          onWarning: () => {
            const active = planRef.current;
            const eventKey = `${initialPlan.id}:warning`;
            if (!active || active.id !== initialPlan.id || active.warningSent || fired.has(eventKey)) return;
            fired.add(eventKey);
            updatePlan(slot, { ...active, warningSent: true });
            setNotice(slot, 'warning');
          },
          onComplete: () => {
            const active = planRef.current;
            const eventKey = `${initialPlan.id}:complete`;
            if (!active || active.id !== initialPlan.id || fired.has(eventKey)) return;
            fired.add(eventKey);
            updatePlan(slot, null);
            setNotice(slot, 'complete');
          },
        });
      } catch {
        updatePlan(slot, null);
        return;
      }

      if (scheduled.alreadyEnded) {
        updatePlan(slot, null);
        return;
      }
      timers.push(scheduled.cancel);
      if (scheduled.warningSkipped) {
        // A page opened after the warning deadline skips that stale warning.
        updatePlan(slot, { ...initialPlan, warningSent: true });
      }
    };

    schedulePlan('work', workPlan);
    schedulePlan('break', breakPlan);
    return () => timers.forEach((cancel) => cancel());
  }, [workPlan, breakPlan, updatePlan, setNotice]);

  useEffect(() => () => {
    soundEnabledRef.current = false;
    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  const getDuration = (values: PlannerValues) => {
    try {
      return calculateWorkBreakDuration(values.start, values.end);
    } catch {
      return null;
    }
  };

  return (
    <section className="time-calculator-section work-break-planner" aria-labelledby="work-break-planner-title">
      <div className="work-break-planner-heading">
        <div className="time-calculator-intro">
          <p className="feature-eyebrow"><FiClock /> Work &amp; Break Planner</p>
          <h2 id="work-break-planner-title">Planifikimi i kohës</h2>
          <p>Caktoni veçmas orarin e punës dhe të pauzës. Kohëzgjatja llogaritet automatikisht.</p>
        </div>
        <div className="work-break-sound-control">
          <button type="button" className="feature-button feature-button--quiet" onClick={toggleSounds} aria-pressed={soundsEnabled}>
            {soundsEnabled ? <FiVolume2 /> : <FiVolumeX />}
            {soundsEnabled ? 'Tingujt janë aktivë' : 'Aktivizo tingujt'}
          </button>
          <p>Njoftimet dhe tingujt funksionojnë kur kjo faqe është e hapur.</p>
          {soundError && <p className="work-break-error" role="alert">{soundError}</p>}
        </div>
      </div>

      <div className="work-break-grid">
        <PlannerCard
          slot="work"
          title="Koha e Punës"
          values={workValues}
          duration={getDuration(workValues)}
          plan={workPlan}
          notice={workNotice}
          error={workError}
          onTimeChange={handleTimeChange}
          onActivate={activatePlan}
          onStop={stopPlan}
          onDismissNotice={(slot) => { if (slot === 'work') setWorkNotice(null); }}
        />
        <PlannerCard
          slot="break"
          title="Koha e Pauzës"
          values={breakValues}
          duration={getDuration(breakValues)}
          plan={breakPlan}
          notice={breakNotice}
          error={breakError}
          onTimeChange={handleTimeChange}
          onActivate={activatePlan}
          onStop={stopPlan}
          onDismissNotice={(slot) => { if (slot === 'break') setBreakNotice(null); }}
        />
      </div>
    </section>
  );
};

export default WorkBreakPlanner;
