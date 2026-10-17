import React, { useEffect, useMemo, useState } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi';
import { taskService } from '../services/api';
import { Task } from '../types';
import { getErrorMessage } from '../lib/axios';

type CalendarDay = { date: Date; inCurrentMonth: boolean };
type CalendarView = 'month' | 'week';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CalendarPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => formatLocalDate(new Date()));
  const [view, setView] = useState<CalendarView>('month');
  const [monthCursor, setMonthCursor] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  useEffect(() => {
    let cancelled = false;

    const loadTasks = async () => {
      setLoading(true);
      try {
        const data = await taskService.getTasks();
        if (!cancelled) {
          setTasks(data);
          setError('');
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(getErrorMessage(requestError, 'Unable to load calendar activities.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadTasks();
    return () => { cancelled = true; };
  }, []);

  const calendarDays = useMemo<CalendarDay[]>(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const totalDays = new Date(year, month + 1, 0).getDate();
    const cells: CalendarDay[] = [];

    for (let offset = 0; offset < firstDay.getDay(); offset += 1) {
      const date = new Date(year, month, offset - firstDay.getDay() + 1);
      cells.push({ date, inCurrentMonth: false });
    }

    for (let day = 1; day <= totalDays; day += 1) {
      cells.push({ date: new Date(year, month, day), inCurrentMonth: true });
    }

    while (cells.length < 42) {
      const lastDate = cells[cells.length - 1]?.date ?? new Date(year, month, 1);
      const date = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + 1);
      cells.push({ date, inCurrentMonth: date.getMonth() === month });
    }

    return cells;
  }, [monthCursor]);

  const visibleDays = useMemo(() => {
    if (view === 'month') return calendarDays;

    const selected = new Date(`${selectedDate}T12:00:00`);
    const weekStart = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate() - selected.getDay());
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + index);
      return { date, inCurrentMonth: date.getMonth() === monthCursor.getMonth() };
    });
  }, [calendarDays, monthCursor, selectedDate, view]);

  const selectedDayTasks = useMemo(
    () => tasks.filter((task) => task.dueDate === selectedDate).sort((a, b) => (a.startTime || '').localeCompare(b.startTime || '')),
    [selectedDate, tasks],
  );

  const monthTaskCount = useMemo(() => {
    const year = monthCursor.getFullYear();
    const month = String(monthCursor.getMonth() + 1).padStart(2, '0');
    const prefix = `${year}-${month}-`;
    return tasks.filter((task) => task.dueDate.startsWith(prefix)).length;
  }, [monthCursor, tasks]);

  const selectedDateObject = new Date(`${selectedDate}T12:00:00`);
  const selectedDateLabel = selectedDateObject.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
  const today = formatLocalDate(new Date());

  const moveMonth = (amount: number) => {
    if (view === 'week') {
      const nextDate = new Date(`${selectedDate}T12:00:00`);
      nextDate.setDate(nextDate.getDate() + amount * 7);
      setSelectedDate(formatLocalDate(nextDate));
      setMonthCursor(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
      return;
    }

    const nextMonth = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + amount, 1);
    const selected = new Date(`${selectedDate}T12:00:00`);
    setMonthCursor(nextMonth);
    if (selected.getFullYear() !== nextMonth.getFullYear() || selected.getMonth() !== nextMonth.getMonth()) {
      const lastDay = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
      setSelectedDate(formatLocalDate(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), Math.min(selected.getDate(), lastDay))));
    }
  };

  const selectDate = (date: Date) => {
    setSelectedDate(formatLocalDate(date));
    if (date.getFullYear() !== monthCursor.getFullYear() || date.getMonth() !== monthCursor.getMonth()) {
      setMonthCursor(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  const goToToday = () => {
    const now = new Date();
    setSelectedDate(formatLocalDate(now));
    setMonthCursor(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  return (
    <div className="feature-page calendar-page px-4 py-7 sm:px-6 lg:px-8">
      <header className="feature-heading mb-6">
        <div>
          <p className="feature-eyebrow"><FiCalendar /> Calendar</p>
          <h1>Plan your time</h1>
          <p className="feature-heading-copy">A clear view of the tasks scheduled in your workspace.</p>
        </div>
        <div className="calendar-toolbar" aria-label="Calendar view controls">
          <div className="calendar-view-switch" role="group" aria-label="Calendar view">
            <button type="button" onClick={() => setView('month')} className={view === 'month' ? 'is-selected' : ''}>Month</button>
            <button type="button" onClick={() => setView('week')} className={view === 'week' ? 'is-selected' : ''}>Week</button>
          </div>
          <button type="button" onClick={goToToday} className="calendar-today-button">Today</button>
        </div>
      </header>

      {error && <div className="calendar-error" role="alert">{error}</div>}

      <div className="calendar-layout">
        <section className="calendar-card" aria-label="Calendar dates">
          <div className="calendar-card-header">
            <div className="calendar-month-heading">
              <span className="calendar-heading-icon"><FiCalendar /></span>
              <div>
                <h2>{monthCursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
                <p>{error ? 'Activities unavailable' : `${monthTaskCount} ${monthTaskCount === 1 ? 'event' : 'events'} this month`}</p>
              </div>
            </div>
            <div className="calendar-month-actions">
              <button type="button" onClick={() => moveMonth(-1)} aria-label={view === 'week' ? 'Previous week' : 'Previous month'}><FiChevronLeft /></button>
              <button type="button" onClick={() => moveMonth(1)} aria-label={view === 'week' ? 'Next week' : 'Next month'}><FiChevronRight /></button>
            </div>
          </div>

          <div className="calendar-weekdays" aria-hidden="true">
            {weekdays.map((day) => <span key={day}>{day}</span>)}
          </div>

          <div className={`calendar-days ${view === 'week' ? 'calendar-days--week' : ''}`}>
            {visibleDays.map((cell) => {
              const isoDate = formatLocalDate(cell.date);
              const isToday = isoDate === today;
              const isSelected = isoDate === selectedDate;
              const taskCount = tasks.filter((task) => task.dueDate === isoDate).length;

              return (
                <button
                  key={isoDate}
                  type="button"
                  onClick={() => selectDate(cell.date)}
                  aria-label={`${cell.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}${taskCount ? `, ${taskCount} ${taskCount === 1 ? 'event' : 'events'}` : ''}`}
                  aria-pressed={isSelected}
                  className={`calendar-day ${cell.inCurrentMonth ? '' : 'is-outside'} ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
                >
                  <span className="calendar-day-number">{cell.date.getDate()}</span>
                  {taskCount > 0 && <span className="calendar-day-dots" aria-hidden="true">{Array.from({ length: Math.min(taskCount, 3) }, (_, index) => <i key={index} />)}</span>}
                </button>
              );
            })}
          </div>
          {loading && <p className="calendar-loading" role="status">Loading activities…</p>}
        </section>

        <section className="calendar-events" aria-labelledby="calendar-events-title">
          <div className="calendar-events-header">
            <span className="calendar-events-icon"><FiClock /></span>
            <div>
              <p className="calendar-events-kicker">{selectedDate === today ? 'Scheduled activities' : 'Activities for selected date'}</p>
              <h2 id="calendar-events-title">{selectedDate === today ? "Today's Events" : selectedDateLabel}</h2>
              {selectedDate === today && <p className="calendar-events-date">{selectedDateLabel}</p>}
            </div>
          </div>

          {loading ? (
            <div className="calendar-empty" role="status">Loading this day’s activities…</div>
          ) : error ? (
            <div className="calendar-empty">Activities could not be loaded right now.</div>
          ) : selectedDayTasks.length === 0 ? (
            <div className="calendar-empty">
              <span className="calendar-empty-mark"><FiCalendar /></span>
              <strong>No activities on this date</strong>
              <span>Your scheduled tasks will appear here.</span>
            </div>
          ) : (
            <div className="calendar-event-list">
              {selectedDayTasks.map((task) => {
                const accent = task.priority === 'high' ? 'violet' : task.priority === 'low' ? 'green' : 'blue';
                const taskTime = task.startTime
                  ? `${task.startTime}${task.endTime ? ` – ${task.endTime}` : ''}`
                  : 'Any time';
                return (
                  <article className={`calendar-event calendar-event--${accent}`} key={task.id}>
                    <span className="calendar-event-rule" aria-hidden="true" />
                    <div className="calendar-event-copy">
                      <h3>{task.title}</h3>
                      <p>{task.description || 'No description provided.'}</p>
                      <span className="calendar-event-category">{task.category || 'General'} · {task.priority}</span>
                    </div>
                    <time className="calendar-event-time">{taskTime}</time>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CalendarPage;
