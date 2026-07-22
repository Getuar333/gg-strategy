import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiCheckCircle, FiClock, FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import { getErrorMessage } from '../lib/axios';
import { isEndTimeValid } from '../lib/taskUtils';
import { taskService } from '../services/api';
import { CreateTaskInput, Task, TaskPriority, TaskStatus, UpdateTaskInput } from '../types';
import AnimatedMetricCard from '../components/AnimatedMetricCard';
import Button from '../components/Button';
import GlassPanel from '../components/GlassPanel';
import storyImage from "../assets/G.G Strategy-story.png";

interface TaskFormState extends CreateTaskInput {
  status: TaskStatus;
  emoji: string;
}

const today = new Date().toISOString().slice(0, 10);

const emptyTask: TaskFormState = {
  title: '',
  description: '',
  priority: 'medium',
  category: 'meeting',
  dueDate: today,
  colorLabel: '#ff7a1a',
  startTime: '09:00',
  endTime: '10:00',
  status: 'pending',
  emoji: '✨',
};
const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};
const priorityLabels: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};
const categoryOptions = ['meeting', 'study', 'focus', 'creative', 'personal'];
const emojiOptions = ['✨', '🎯', '📚', '💼', '⚡', '🧠'];
const formatDisplayDate = (value: string | null | undefined): string => {
  if (!value) return 'No date';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No date';
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};
const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [draftTask, setDraftTask] = useState<TaskFormState>(emptyTask);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTask, setEditTask] = useState<TaskFormState>(emptyTask);
  const [timeError, setTimeError] = useState('');
  const fetchTasks = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load tasks.'));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void fetchTasks();
  }, []);
  const filteredTasks = useMemo(() => {
    const priorityOrder: Record<TaskPriority, number> = {
      high: 0,
      medium: 1,
      low: 2,
    };
    const term = searchTerm.trim().toLowerCase();
    return [...tasks]
      .filter((task) => {
        const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
        const matchesSearch =
          term.length === 0 ||
          task.title.toLowerCase().includes(term) ||
          (task.description && task.description.toLowerCase().includes(term)) ||
          task.category.toLowerCase().includes(term);

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(a.dueDate || '9999-12-31').getTime() - new Date(b.dueDate || '9999-12-31').getTime();
      });
  }, [filterStatus, searchTerm, sortBy, tasks]);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'completed').length;
    const inProgress = tasks.filter((task) => task.status === 'in_progress').length;
    const pending = tasks.filter((task) => task.status === 'pending').length;
    const overdue = tasks.filter((task) => task.status !== 'completed' && task.dueDate && task.dueDate < today).length;

    return [
      { label: 'Total tasks', value: tasks.length, detail: 'All tasks', accent: 'from-[#ff5e3a] to-[#ff9a3c]', icon: <FiCheckCircle /> },
      { label: 'Completed', value: completed, detail: 'Wins', accent: 'from-[#22c55e] to-[#34d399]', icon: <FiCheckCircle /> },
      { label: 'In Progress', value: inProgress, detail: 'His working', accent: 'from-[#38bdf8] to-[#0ea5e9]', icon: <FiClock /> },
      { label: 'Pending', value: pending, detail: 'Not ready', accent: 'from-[#f59e0b] to-[#f97316]', icon: <FiCalendar /> },
      { label: 'Not Started', value: overdue, detail: 'Ripped', accent: 'from-[#fb7185] to-[#ef4444]', icon: <FiClock /> },
    ];
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    return tasks.filter((task) => task.status !== 'completed').slice(0, 4);
  }, [tasks]);

  const resetDraft = (): void => {
    setDraftTask(emptyTask);
    setShowCreateForm(false);
    setTimeError('');
  };

  const handleDraftChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    if (name === 'endTime' && draftTask.startTime) {
      setTimeError(isEndTimeValid(draftTask.startTime, value) ? '' : 'End time must be after start time');
    } else if (name === 'startTime' && draftTask.endTime) {
      setTimeError(isEndTimeValid(value, draftTask.endTime) ? '' : 'End time must be after start time');
    }
    setDraftTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    if (name === 'endTime' && editTask.startTime) {
      setTimeError(isEndTimeValid(editTask.startTime, value) ? '' : 'End time must be after start time');
    } else if (name === 'startTime' && editTask.endTime) {
      setTimeError(isEndTimeValid(value, editTask.endTime) ? '' : 'End time must be after start time');
    }
    setEditTask((prev) => ({ ...prev, [name]: value }));
  };

  const startEditingTask = (task: Task): void => {
    setError('');
    setTimeError('');
    setShowCreateForm(false);
    setEditingTaskId(task.id);
    setEditTask({
      title: task.title.replace(/^\p{Emoji}\s*/u, ''),
      description: task.description,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate || today,
      status: task.status,
      colorLabel: task.colorLabel || '#ff7a1a',
      startTime: task.startTime || '09:00',
      endTime: task.endTime || '10:00',
      emoji: task.title.match(/^\p{Emoji}/u)?.[0] || '✨',
    });
  };

  const cancelEditingTask = (): void => {
    setEditingTaskId(null);
    setEditTask(emptyTask);
    setTimeError('');
  };

  const handleCreateTask = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {
      setSaving(true);
      const payload: CreateTaskInput = {
        title: `${draftTask.emoji} ${draftTask.title.trim()}`,
        description: (draftTask.description ?? '').trim(),
        priority: draftTask.priority,
        category: draftTask.category,
        dueDate: draftTask.dueDate,
        startTime: draftTask.startTime,
        endTime: draftTask.endTime,
        colorLabel: draftTask.colorLabel,
      };
      const created = await taskService.createTask(payload);
      setTasks((prev) => [created, ...prev]);
      setDraftTask(emptyTask);
      setShowCreateForm(false);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create task.'));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTask = async (event: React.FormEvent<HTMLFormElement>, task: Task): Promise<void> => {
    event.preventDefault();
    try {
      setSaving(true);
      const payload: UpdateTaskInput = {
        title: `${editTask.emoji} ${editTask.title.trim()}`,
        description: (editTask.description ?? '').trim(),
        priority: editTask.priority,
        category: editTask.category,
        dueDate: editTask.dueDate,
        startTime: editTask.startTime,
        endTime: editTask.endTime,
        status: editTask.status,
        colorLabel: editTask.colorLabel,
      };
      const updated = await taskService.updateTask(task.id, payload);
      setTasks((prev) => prev.map((current) => (current.id === task.id ? updated : current)));
      cancelEditingTask();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update task.'));
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteTask = async (id: number): Promise<void> => {
    try {
      const updated = await taskService.markTaskComplete(id);
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to complete task.'));
    }
  };

  const handleDeleteTask = async (id: number): Promise<void> => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete task.'));
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-black/30 px-6 py-6 backdrop-blur-2xl lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/70">take your risk</p>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">Create your task with precision , execute with focus.</p>
          </div>
          <Button type="button" onClick={() => setShowCreateForm((value) => !value)}>
            <FiPlus className="h-4 w-4" />
            {showCreateForm ? 'Close panel' : 'New task'}
          </Button>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => (
            <AnimatedMetricCard key={stat.label} title={stat.label} value={stat.value} detail={stat.detail} accent={stat.accent} icon={stat.icon} />
          ))}
        </section>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100">
            {error}
          </div>
        )}

        {showCreateForm && (
          <GlassPanel className="mb-6 p-6">
            <form onSubmit={handleCreateTask} className="grid gap-4 lg:grid-cols-2">
              <div className="lg:col-span-2 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">Create a new mission</p>
                  <p className="text-sm text-slate-400">Capture the plan, schedule, and context in one place.</p>
                </div>
              </div>
              <label className="block lg:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-300">Title</span>
                <input name="title" value={draftTask.title} onChange={handleDraftChange} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none ring-0 focus:border-cyan-400/40" placeholder="Please enter your title." />
              </label>
              <label className="block lg:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-300">Description</span>
                <textarea name="description" value={draftTask.description} onChange={handleDraftChange} className="min-h-24 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400/40" placeholder="What is yours description." />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">Category</span>
                <select name="category" value={draftTask.category} onChange={handleDraftChange} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-cyan-400/40">
                  {categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">Priority</span>
                <select name="priority" value={draftTask.priority} onChange={handleDraftChange} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-cyan-400/40">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-800">Emoji</span>
                <select name="emoji" value={draftTask.emoji} onChange={handleDraftChange} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-cyan-400/40">
                  {emojiOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-800">Due date</span>
                <input type="date" name="dueDate" value={draftTask.dueDate} onChange={handleDraftChange} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-cyan-400/40" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-800">Start time</span>
                <input type="time" name="startTime" value={draftTask.startTime || ''} onChange={handleDraftChange} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-cyan-400/40" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-800">End time</span>
                <input type="time" name="endTime" value={draftTask.endTime || ''} onChange={handleDraftChange} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-cyan-400/40" />
              </label>
              {timeError && <p className="lg:col-span-2 text-sm text-rose-200">{timeError}</p>}
              <div className="lg:col-span-2 flex flex-wrap justify-end gap-3">
                <Button type="button" variant="secondary" onClick={resetDraft}>Cancel</Button>
                <Button type="submit" loading={saving}>Create task</Button>
              </div>
            </form>
          </GlassPanel>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <GlassPanel>
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-black">Task board</p>
                <p className="text-sm text-slate-400">Search and filter all tasks.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                  <FiSearch className="h-4 w-4" />
                  <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="bg-transparent text-sm outline-none" placeholder="Search tasks" />
                </label>
                <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value as TaskStatus | 'all')} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 outline-none">
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value as 'dueDate' | 'priority')} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 outline-none">
                  <option value="dueDate">Due date</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="py-10 text-center text-slate-400">Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
              <div className="py-10 text-center text-slate-400">No tasks match this view yet.</div>
            ) : (
              <div className="mt-5 space-y-4">
                {filteredTasks.map((task) => (
                  <motion.article key={task.id} whileHover={{ y: -2 }} className="rounded-3xl border border-white/10 bg-black/30 p-4">
                    {editingTaskId === task.id ? (
                      <form onSubmit={(event) => void handleUpdateTask(event, task)} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <label className="md:col-span-2 block">
                            <span className="mb-2 block text-sm font-medium text-slate-300">Title</span>
                            <input name="title" value={editTask.title} onChange={handleEditChange} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none" />
                          </label>
                          <label className="md:col-span-2 block">
                            <span className="mb-2 block text-sm font-medium text-slate-300">Description</span>
                            <textarea name="description" value={editTask.description} onChange={handleEditChange} className="min-h-24 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
                          </label>
                          <label className="block">
                            <span className="mb-2 block text-sm font-medium text-slate-300">Status</span>
                            <select name="status" value={editTask.status} onChange={handleEditChange} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none">
                              {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                            </select>
                          </label>
                          <label className="block">
                            <span className="mb-2 block text-sm font-medium text-slate-300">Priority</span>
                            <select name="priority" value={editTask.priority} onChange={handleEditChange} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none">
                              <option value="high">High</option>
                              <option value="medium">Medium</option>
                              <option value="low">Low</option>
                            </select>
                          </label>
                          <label className="block">
                            <span className="mb-2 block text-sm font-medium text-slate-300">Emoji</span>
                            <select name="emoji" value={editTask.emoji} onChange={handleEditChange} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none">
                              {emojiOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                            </select>
                          </label>
                          <label className="block">
                            <span className="mb-2 block text-sm font-medium text-slate-300">Due date</span>
                            <input type="date" name="dueDate" value={editTask.dueDate} onChange={handleEditChange} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none" />
                          </label>
                          <label className="block">
                            <span className="mb-2 block text-sm font-medium text-slate-300">Start time</span>
                            <input type="time" name="startTime" value={editTask.startTime || ''} onChange={handleEditChange} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none" />
                          </label>
                          <label className="block">
                            <span className="mb-2 block text-sm font-medium text-slate-300">End time</span>
                            <input type="time" name="endTime" value={editTask.endTime || ''} onChange={handleEditChange} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none" />
                          </label>
                        </div>
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button type="button" variant="secondary" onClick={cancelEditingTask}>Cancel</Button>
                          <Button type="submit" loading={saving}>Save changes</Button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-lg">{task.title.match(/^\p{Emoji}/u)?.[0] || '✨'}</span>
                              <h3 className="text-lg font-semibold text-white">{task.title.replace(/^\p{Emoji}\s*/u, '')}</h3>
                            </div>
                            <p className="mt-2 text-sm text-slate-400">{task.description || 'No description provided.'}</p>
                          </div>
                          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">{priorityLabels[task.priority]}</div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">{task.category}</span>
                          <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs text-orange-200">{statusLabels[task.status]}</span>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{formatDisplayDate(task.dueDate)}</span>
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{task.startTime || '--:--'} → {task.endTime || '--:--'}</span>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-2">
                          <Button type="button" variant="secondary" onClick={() => startEditingTask(task)}>
                            <FiEdit2 className="h-4 w-4" /> Edit
                          </Button>
                          {task.status !== 'completed' && (
                            <Button type="button" variant="outline" onClick={() => void handleCompleteTask(task.id)}>
                              <FiCheckCircle className="h-4 w-4" /> Complete
                            </Button>
                          )}
                          <Button type="button" variant="danger" onClick={() => void handleDeleteTask(task.id)}>
                            <FiTrash2 className="h-4 w-4" /> Delete
                          </Button>
                        </div>
                      </>
                    )}
                  </motion.article>
                ))}
              </div>
            )}
          </GlassPanel>

          <div className="space-y-6">
            <GlassPanel>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Upcoming task</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {upcomingTasks.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">No upcoming tasks right now.</p>
                ) : (
                  upcomingTasks.map((task) => (
                    <div key={task.id} className="rounded-2xl border border-white/10 bg-black/30 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-white">{task.title.replace(/^\p{Emoji}\s*/u, '')}</p>
                        <span className="text-xs uppercase tracking-[0.3em] text-cyan-200">{task.priority}</span>
                      </div>
                      <p className="mt-2 text-xs text-slate-400">{formatDisplayDate(task.dueDate)}</p>
                    </div>
                  ))
                )}
              </div>
            </GlassPanel>
            <GlassPanel className="overflow-hidden p-0"><img src={storyImage} alt="G.G Strategy" className="w-full h-full object-cover rounded-[inherit]"/>
            </GlassPanel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
