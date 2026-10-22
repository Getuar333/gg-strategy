import React, { useEffect, useState } from 'react';
import { FiArrowDown, FiCalendar, FiClock, FiRefreshCw } from 'react-icons/fi';
import WorkBreakPlanner from '../components/WorkBreakPlanner';
import { calculateDurationMinutes } from '../lib/timeCalculator';

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

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 250);
    return () => window.clearInterval(timer);
  }, []);

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

      <WorkBreakPlanner />

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
