import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi';
import { taskService } from '../services/api';
import { Task } from '../types';
import GlassPanel from '../components/GlassPanel';

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2,'0');
  const day = String(date.getDate()).padStart(2,'0');
  return `${year}-${month}-${day}`;
};

const CalendarPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [view, setView] = useState<'month' | 'week'>('month');
  const [monthCursor, setMonthCursor] = useState(new Date());

  useEffect(() => {
    const loadTasks = async () => {
      const data = await taskService.getTasks();
      setTasks(data);
    };

    void loadTasks();
  }, []);

  useEffect(() => {
    const today = new Date();
    setSelectedDate(formatLocalDate(today));
  }, []);

  const calendarDays = useMemo(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    const leadingDays = firstDay.getDay();
    const cells: Array<{ date: Date; inCurrentMonth: boolean }> = [];

    for (let i = 0; i < leadingDays; i += 1) {
      const date = new Date(year, month, i - leadingDays + 1);
      cells.push({ date, inCurrentMonth: false });
    }

    for (let day = 1; day <= totalDays; day += 1) {
      cells.push({ date: new Date(year, month, day), inCurrentMonth: true });
    }

    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1]?.date ?? new Date();
      cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inCurrentMonth: false });
    }

    return cells;
  }, [monthCursor]);

  const selectedDayTasks = useMemo(() => {
    if (!selectedDate) {
      return [];
    }

    return tasks.filter((task) => task.dueDate === selectedDate);
  }, [selectedDate, tasks]);

  const goToPrevious = () => {
    setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1));
  };

  const goToNext = () => {
    setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setMonthCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(formatLocalDate(today));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,88,59,0.2),_transparent_35%),linear-gradient(135deg,_#04060b_0%,_#090d16_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">Calendar</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Your Plan week</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setView('month')} className={`rounded-full px-4 py-2 text-sm ${view === 'month' ? 'bg-cyan-500/20 text-cyan-200' : 'bg-white/10 text-slate-300'}`}>Month's</button>
          <button type="button" onClick={() => setView('week')} className={`rounded-full px-4 py-2 text-sm ${view === 'week' ? 'bg-cyan-500/20 text-cyan-200' : 'bg-white/10 text-slate-300'}`}>Week's</button>
          <button type="button" onClick={goToToday} className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white">Today's</button>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <GlassPanel className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-500/15 p-2 text-cyan-200"><FiCalendar /></div>
              <div>
                <p className="text-sm font-semibold text-white">{monthCursor.toLocaleString('en', { month: 'long', year: 'numeric' })}</p>
                <p className="text-xs text-slate-400">{view === 'month' ? 'Monthly overview' : 'Weekly overview'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={goToPrevious} className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300"><FiChevronLeft /></button>
              <button type="button" onClick={goToNext} className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300"><FiChevronRight /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-white/10 bg-black/20 text-center text-xs uppercase tracking-[0.3em] text-slate-500">
            {weekdayLabels.map((label) => (
              <div key={label} className="py-3">{label}</div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((cell, index) => {
              const isoDate = formatLocalDate(cell.date);
              const hasTasks = tasks.some((task) => task.dueDate === isoDate);
              const isToday = isoDate === formatLocalDate(new Date());
              const isSelected = isoDate === selectedDate;

              return (
                <motion.button
                  key={`${isoDate}-${index}`}
                  whileHover={{ scale: 1.02 }}
                  type="button"
                  onClick={() => setSelectedDate(isoDate)}
                  className={`min-h-[96px] border-b border-r border-white/10 p-3 text-left transition ${cell.inCurrentMonth ? 'bg-transparent text-white' : 'bg-white/5 text-slate-500'} ${isSelected ? 'bg-cyan-500/15 ring-1 ring-cyan-400/30' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${isToday ? 'rounded-full bg-cyan-500/20 px-2 py-1 text-cyan-200' : ''}`}>{cell.date.getDate()}</span>
                    {hasTasks && <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />}
                  </div>
                  <div className="mt-3 space-y-1">
                    {tasks.filter((task) => task.dueDate === isoDate).slice(0, 2).map((task) => (
                      <div key={task.id} className="truncate rounded-full bg-white/10 px-2 py-1 text-[10px] text-slate-300">
                        {task.title}
                      </div>
                    ))}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </GlassPanel>

        <GlassPanel>
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="rounded-2xl bg-orange-500/15 p-2 text-orange-300"><FiClock /></div>
            <div>
              <p className="text-sm font-semibold text-white">{selectedDate || 'Select a day'}</p>
              <p className="text-xs text-slate-400">Scheduled tasks</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {selectedDayTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">No tasks per today.</div>
            ) : (
              selectedDayTasks.map((task) => (
                <div key={task.id} className="rounded-2xl border border-white/10 bg-black/30 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{task.title}</p>
                    <span className="rounded-full bg-cyan-500/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.25em] text-cyan-200">{task.priority}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{task.description || 'No description provided.'}</p>
                  <p className="mt-3 text-xs text-slate-500">{task.startTime || '--:--'} - {task.endTime || '--:--'}</p>
                </div>
              ))
            )}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};

export default CalendarPage;
