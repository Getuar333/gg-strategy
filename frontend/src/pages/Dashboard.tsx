import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiCheckCircle,
  FiEdit2,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiX,
  FiAlertCircle,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../lib/axios';
import { taskService } from '../services/api';
import { CreateTaskInput, Task, TaskPriority, TaskStatus, UpdateTaskInput } from '../types';
import { formatDate, isEndTimeValid, TASK_CATEGORIES } from '../lib/taskUtils';
import Button from '../components/Button';

const today = new Date().toISOString().slice(0, 10);

const emptyTask: CreateTaskInput & { startTime?: string; endTime?: string } = {
  title: '',
  description: '',
  priority: 'medium',
  category: 'meeting',
  dueDate: today,
  colorLabel: '#e11d48',
  startTime: '09:00',
  endTime: '10:00',
};

const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pa filluar',
  in_progress: 'Duke u punuar',
  completed: 'E përfunduar',
  cancelled: 'E anuluar',
};

const priorityLabels: Record<TaskPriority, string> = {
  low: 'I Ulët',
  medium: 'I Mesëm',
  high: 'I Lartë',
};

const priorityClasses: Record<TaskPriority, string> = {
  high: 'border-rose-400/40 bg-rose-500/15 text-rose-100',
  medium: 'border-amber-300/35 bg-amber-400/15 text-amber-100',
  low: 'border-emerald-300/35 bg-emerald-400/15 text-emerald-100',
};

// ==================== INPUT FIELD CLASSES ====================
const textFieldClass =
  'h-11 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20';

const textareaClass =
  'w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20 min-h-24 resize-vertical';

const selectFieldClass =
  'h-11 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20 appearance-none';

const timeFieldClass =
  'h-11 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20';

const Dashboard: React.FC = () => {
  const { user: _user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [draftTask, setDraftTask] = useState(emptyTask);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTask, setEditTask] = useState<UpdateTaskInput & { startTime?: string; endTime?: string }>({});
  const [timeError, setTimeError] = useState('');

  // ==================== FETCH TASKS ====================
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

  // ==================== FILTER & SORT ====================
  const filteredTasks = useMemo(() => {
    const priorityOrder: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
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

  // ==================== STATISTICS ====================
  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'completed').length;
    const inProgress = tasks.filter((task) => task.status === 'in_progress').length;
    const overdue = tasks.filter((task) => task.status !== 'completed' && task.dueDate && task.dueDate < today).length;

    return [
      { label: 'Totali', value: tasks.length, accent: 'from-pink-400 to-pink-600' },
      { label: 'Të Përfunduara', value: completed, accent: 'from-green-400 to-green-600' },
      { label: 'Në Progres', value: inProgress, accent: 'from-blue-400 to-blue-600' },
      { label: 'Të pa Përfunduara', value: overdue, accent: 'from-red-400 to-red-600' },
    ];
  }, [tasks]);

  // ==================== HANDLERS ====================
  const handleDraftChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    
    // Validate time range
    if (name === 'endTime' && draftTask.startTime) {
      if (!isEndTimeValid(draftTask.startTime, value)) {
        setTimeError('End time must be after start time');
      } else {
        setTimeError('');
      }
    } else if (name === 'startTime' && draftTask.endTime) {
      if (!isEndTimeValid(value, draftTask.endTime)) {
        setTimeError('End time must be after start time');
      } else {
        setTimeError('');
      }
    }

    setDraftTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;

    // Validate time range
    if (name === 'endTime' && editTask.startTime) {
      if (!isEndTimeValid(editTask.startTime, value)) {
        setTimeError('End time must be after start time');
      } else {
        setTimeError('');
      }
    } else if (name === 'startTime' && editTask.endTime) {
      if (!isEndTimeValid(value, editTask.endTime)) {
        setTimeError('End time must be after start time');
      } else {
        setTimeError('');
      }
    }

    setEditTask((prev) => ({ ...prev, [name]: value }));
  };

  const startEditingTask = (task: Task): void => {
    setError('');
    setTimeError('');
    setShowCreateForm(false);
    setEditingTaskId(task.id);
    setEditTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate || today,
      status: task.status,
      colorLabel: task.colorLabel || '#e11d48',
      startTime: (task as any).startTime || '09:00',
      endTime: (task as any).endTime || '10:00',
    });
  };

  const cancelEditingTask = (): void => {
    setEditingTaskId(null);
    setEditTask({});
    setTimeError('');
  };

  // ==================== CREATE TASK ====================
  const handleCreateTask = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!draftTask.title.trim()) {
      setError('Emri i detyrës është i nevojshëm.');
      return;
    }

    if (draftTask.startTime && draftTask.endTime) {
      if (!isEndTimeValid(draftTask.startTime, draftTask.endTime)) {
        setError('End time must be after start time');
        return;
      }
    }

    try {
      setSaving(true);
      setError('');
      setTimeError('');
      const created = await taskService.createTask({
        ...draftTask,
        title: draftTask.title.trim(),
        description: draftTask.description?.trim(),
        category: draftTask.category?.trim() || 'meeting',
      });
      setTasks((prev) => [created, ...prev]);
      setDraftTask(emptyTask);
      setShowCreateForm(false);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create task.'));
    } finally {
      setSaving(false);
    }
  };

  // ==================== UPDATE TASK ====================
  const handleUpdateTask = async (event: React.FormEvent<HTMLFormElement>, task: Task): Promise<void> => {
    event.preventDefault();

    if (!editTask.title?.trim()) {
      setError('Emri i detyrës është i nevojshëm.');
      return;
    }

    if (editTask.startTime && editTask.endTime) {
      if (!isEndTimeValid(editTask.startTime, editTask.endTime)) {
        setError('End time must be after start time');
        return;
      }
    }

    const nextTask: UpdateTaskInput & { startTime?: string; endTime?: string } = {
      title: editTask.title?.trim() || task.title,
      description: editTask.description?.trim() || task.description || '',
      priority: editTask.priority || task.priority,
      category: editTask.category?.trim() || 'meeting',
      dueDate: editTask.dueDate || task.dueDate || today,
      status: editTask.status || task.status,
      colorLabel: editTask.colorLabel || task.colorLabel || '#e11d48',
      startTime: editTask.startTime || (task as any).startTime || '09:00',
      endTime: editTask.endTime || (task as any).endTime || '10:00',
    };

    try {
      setSaving(true);
      setError('');
      setTimeError('');
      const updated = await taskService.updateTask(task.id, nextTask);
      setTasks((prev) => prev.map((item) => (item.id === task.id ? updated : item)));
      cancelEditingTask();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update task.'));
    } finally {
      setSaving(false);
    }
  };

  // ==================== COMPLETE TASK ====================
  const handleCompleteTask = async (id: number): Promise<void> => {
    try {
      setError('');
      const updated = await taskService.markTaskComplete(id);
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to complete task.'));
    }
  };

  // ==================== DELETE TASK ====================
  const handleDeleteTask = async (id: number): Promise<void> => {
    const confirmed = window.confirm('Dëshironi të fshini këtë detyrë?');
    if (!confirmed) {
      return;
    }

    try {
      setError('');
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete task.'));
    }
  };

  return (
    <div className="dashboard-floral-bg relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
        
        {/* ==================== HEADER ==================== */}
        <header className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold lowercase tracking-[0.6em] text-green-100/75">Get your risk</p>
            <h1 className="text-xs font-bold lowercase tracking-[0.2em] text-green-100/75">
              Create your Plan with precision, execute with focus.
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" size="md" onClick={fetchTasks}>
              <FiRefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button type="button" variant="primary" size="md" onClick={() => setShowCreateForm((value) => !value)}>
              {showCreateForm ? <FiX className="h-4 w-4" /> : <FiPlus className="h-4 w-4" />}
              {showCreateForm ? 'Mbyll' : 'Krijoni Detyra'}
            </Button>
          </div>
        </header>

        {/* ==================== STATISTICS ====================  */}
        <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="panel-glass rounded-lg p-4"
            >
              <div className={`mb-3 h-1.5 w-16 rounded-full bg-gradient-to-r ${stat.accent}`} />
              <p className="text-sm font-medium text-slate-300">{stat.label}</p>
              <p className="mt-1 text-3xl font-black text-white">{stat.value}</p>
            </motion.div>
          ))}
        </section>

        {/* ==================== CREATE FORM ==================== */}
        {showCreateForm && (
          <motion.section
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="panel-glass mb-6 rounded-lg p-5"
          >
            <form onSubmit={handleCreateTask} className="space-y-4">
              {/* Title & Description Row */}
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white">Emri i detyrës *</span>
                  <input
                    type="text"
                    name="title"
                    value={draftTask.title}
                    onChange={handleDraftChange}
                    className={textFieldClass}
                    placeholder="Emri i detyrës..."
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white">Data</span>
                  <input
                    type="date"
                    name="dueDate"
                    value={draftTask.dueDate}
                    onChange={handleDraftChange}
                    className={textFieldClass}
                    style={{ colorScheme: 'light' }}
                  />
                </label>
              </div>

              {/* Description */}
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white">Përshkrimi</span>
                <textarea
                  name="description"
                  value={draftTask.description}
                  onChange={handleDraftChange}
                  className={textareaClass}
                  placeholder="Përshkrimi i detyrës suaj"
                />
              </label>

              {/* Time Range */}
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white">Koha e fillimit</span>
                  <input
                    type="time"
                    name="startTime"
                    value={draftTask.startTime || '09:00'}
                    onChange={handleDraftChange}
                    className={timeFieldClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white">Koha e mbarimit</span>
                  <input
                    type="time"
                    name="endTime"
                    value={draftTask.endTime || '10:00'}
                    onChange={handleDraftChange}
                    className={timeFieldClass}
                  />
                </label>
              </div>

              {/* Priority, Category, Color */}
              <div className="grid gap-4 lg:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white">Prioriteti</span>
                  <select
                    name="priority"
                    value={draftTask.priority}
                    onChange={handleDraftChange}
                    className={selectFieldClass}
                  >
                    <option value="low">I Ulët</option>
                    <option value="medium">I Mesëm</option>
                    <option value="high">I Lartë</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white">Kategoria</span>
                  <select
                    name="category"
                    value={draftTask.category}
                    onChange={handleDraftChange}
                    className={selectFieldClass}
                  >
                    {TASK_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white">Ngjyra</span>
                  <input
                    type="color"
                    name="colorLabel"
                    value={draftTask.colorLabel}
                    onChange={handleDraftChange}
                    className="h-11 w-full rounded-lg border border-slate-300 p-1"
                  />
                  <span className="mt-2 block text-xs text-slate-400">Ngjyra e detyrës (opsionale)</span>
                </label>
              </div>

              {/* Time Error */}
              {timeError && (
                <div className="rounded-lg border border-red-400/35 bg-red-950/45 p-3 text-sm text-red-300 flex items-center gap-2">
                  <FiAlertCircle className="flex-shrink-0" />
                  {timeError}
                </div>
              )}

              {/* Submit */}
              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setShowCreateForm(false)}>
                  Anulo
                </Button>
                <Button type="submit" variant="primary" loading={saving}>
                  Krijoni Detyrën
                </Button>
              </div>
            </form>
          </motion.section>
        )}

        {/* ==================== SEARCH & FILTER ==================== */}
        <section className="panel-glass mb-6 rounded-lg p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
            <label className="relative block">
              <FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-12 w-full rounded-lg border border-fuchsia-300/20 bg-black/50 pl-11 pr-4 text-white outline-none focus:border-black-500 focus:ring-2 focus:ring-cyan-300/20"
                placeholder="Kërkoni detyrat sipas emrit, përshkrimit ose kategorisë"
              />
            </label>

            <select
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value as TaskStatus | 'all')}
              className="h-12 rounded-lg border border-fuchsia-300/20 bg-black/70 px-4 text-white outline-none focus:border-black-500"
            >
              <option value="all">Të gjitha</option>
              <option value="pending">Në pritje</option>
              <option value="in_progress">Duke u punuar</option>
              <option value="completed">E përfunduar</option>
              <option value="cancelled">E anuluar</option>
            </select>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as 'dueDate' | 'priority')}
              className="h-12 rounded-lg border border-fuchsia-300/20 bg-black/70 px-4 text-white outline-none focus:border-black-500"
            >
              <option value="dueDate">Kërko sipas datës</option>
              <option value="priority">Sipas prioritetit</option>
            </select>
          </div>
        </section>

        {/* ==================== ERROR MESSAGE ==================== */}
        {error && (
          <div className="mb-6 rounded-lg border border-rose-400/35 bg-rose-950/45 p-4 text-sm text-rose-400 flex items-center gap-2">
            <FiAlertCircle className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* ==================== TASKS LIST ==================== */}
        {loading ? (
          <div className="panel-glass rounded-lg py-16 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
            <p className="mt-4 text-sm text-slate-300">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="panel-glass rounded-lg py-16 text-center">
            <p className="mt-2 text-sm text-slate-400">Ska taska të krijuara për momentin</p>
          </div>
        ) : (
          <section className="grid gap-4 xl:grid-cols-2">
            {filteredTasks.map((task, index) => (
              <motion.article
                key={task.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.035 }}
                className="panel-glass rounded-lg p-5 transition hover:border-cyan-300/45"
              >
                <div className="flex gap-4">
                  <div
                    className="mt-1 h-14 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: task.colorLabel || '#e11d48' }}
                  />
                  <div className="min-w-0 flex-1">
                    {/* Title & Date */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="break-words text-lg font-bold text-white">{task.title}</h2>
                        {task.description && (
                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-300">{task.description}</p>
                        )}
                      </div>
                      <p className="shrink-0 rounded-lg border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-sm font-semibold text-cyan-100 whitespace-nowrap">
                        {formatDate(task.dueDate)}
                      </p>
                    </div>

                    {/* Time Range */}
                    {((task as any).startTime || (task as any).endTime) && (
                      <p className="mt-3 text-sm text-slate-300">
                        <span className="font-semibold">Time:</span> {(task as any).startTime || '09:00'} - {(task as any).endTime || '10:00'}
                      </p>
                    )}

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className={`rounded-lg border px-3 py-1 text-xs font-bold uppercase ${priorityClasses[task.priority]}`}>
                        {priorityLabels[task.priority]}
                      </span>
                      <span className="rounded-lg border border-fuchsia-300/25 bg-fuchsia-500/15 px-3 py-1 text-xs font-bold uppercase text-fuchsia-100">
                        {statusLabels[task.status]}
                      </span>
                      <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                        {task.category}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button type="button" variant="secondary" size="sm" onClick={() => startEditingTask(task)}>
                        <FiEdit2 className="h-4 w-4" />
                        Ndrysho
                      </Button>
                      {task.status !== 'completed' && (
                        <Button type="button" variant="secondary" size="sm" onClick={() => void handleCompleteTask(task.id)}>
                          <FiCheckCircle className="h-4 w-4" />
                          Plotëso
                        </Button>
                      )}
                      <Button type="button" variant="outline" size="sm" onClick={() => void handleDeleteTask(task.id)}>
                        <FiTrash2 className="h-3 w-4" />
                        Fshi
                      </Button>
                    </div>

                    {/* ==================== EDIT FORM ==================== */}
                    {editingTaskId === task.id && (
                      <form
                        onSubmit={(event) => void handleUpdateTask(event, task)}
                        className="mt-5 rounded-lg border border-cyan-200/20 bg-black/35 p-4"
                      >
                        <h3 className="mb-4 text-sm font-bold text-white">Ndrysho Detyrën</h3>

                        <div className="space-y-4">
                          {/* Title & Date */}
                          <div className="grid gap-4 lg:grid-cols-2">
                            <label className="block">
                              <span className="mb-2 block text-sm font-semibold text-slate-200">Emri i detyrës *</span>
                              <input
                                type="text"
                                name="title"
                                value={editTask.title || ''}
                                onChange={handleEditChange}
                                className={textFieldClass}
                                placeholder="Emri i detyrës"
                                required
                              />
                            </label>

                            <label className="block">
                              <span className="mb-2 block text-sm font-semibold text-slate-200">Data</span>
                              <input
                                type="date"
                                name="dueDate"
                                value={editTask.dueDate || today}
                                onChange={handleEditChange}
                                className={textFieldClass}
                                style={{ colorScheme: 'light' }}
                              />
                            </label>
                          </div>

                          {/* Description */}
                          <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-slate-200">Përshkrimi</span>
                            <textarea
                              name="description"
                              value={editTask.description || ''}
                              onChange={handleEditChange}
                              className={textareaClass}
                              placeholder="Përshkrimi i detyrës"
                            />
                          </label>

                          {/* Time Range */}
                          <div className="grid gap-4 lg:grid-cols-2">
                            <label className="block">
                              <span className="mb-2 block text-sm font-semibold text-slate-200">Koha e fillimit</span>
                              <input
                                type="time"
                                name="startTime"
                                value={editTask.startTime || '09:00'}
                                onChange={handleEditChange}
                                className={timeFieldClass}
                              />
                            </label>

                            <label className="block">
                              <span className="mb-2 block text-sm font-semibold text-slate-200">Koha e mbarimit</span>
                              <input
                                type="time"
                                name="endTime"
                                value={editTask.endTime || '10:00'}
                                onChange={handleEditChange}
                                className={timeFieldClass}
                              />
                            </label>
                          </div>

                          {/* Priority, Status, Category */}
                          <div className="grid gap-4 lg:grid-cols-3">
                            <label className="block">
                              <span className="mb-2 block text-sm font-semibold text-slate-200">Prioriteti</span>
                              <select
                                name="priority"
                                value={editTask.priority || task.priority}
                                onChange={handleEditChange}
                                className={selectFieldClass}
                              >
                                <option value="low">I Ulët</option>
                                <option value="medium">I Mesëm</option>
                                <option value="high">I Lartë</option>
                              </select>
                            </label>

                            <label className="block">
                              <span className="mb-2 block text-sm font-semibold text-slate-200">Statusi</span>
                              <select
                                name="status"
                                value={editTask.status || task.status}
                                onChange={handleEditChange}
                                className={selectFieldClass}
                              >
                                <option value="pending">Pa filluar</option>
                                <option value="in_progress">Duke u punuar</option>
                                <option value="completed">E përfunduar</option>
                                <option value="cancelled">E anuluar</option>
                              </select>
                            </label>

                            <label className="block">
                              <span className="mb-2 block text-sm font-semibold text-slate-200">Kategoria</span>
                              <select
                                name="category"
                                value={editTask.category || 'meeting'}
                                onChange={handleEditChange}
                                className={selectFieldClass}
                              >
                                {TASK_CATEGORIES.map((cat) => (
                                  <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>

                          {/* Color */}
                          <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-slate-200">Ngjyra</span>
                            <input
                              type="color"
                              name="colorLabel"
                              value={editTask.colorLabel || task.colorLabel || '#e11d48'}
                              onChange={handleEditChange}
                              className="h-11 w-full rounded-lg border border-slate-300 p-1"
                            />
                            <span className="mt-2 block text-xs text-slate-400">Ngjyra e detyrës (opsionale)</span>
                          </label>

                          {/* Time Error */}
                          {timeError && (
                            <div className="rounded-lg border border-red-400/35 bg-red-950/45 p-3 text-sm text-red-300 flex items-center gap-2">
                              <FiAlertCircle className="flex-shrink-0" />
                              {timeError}
                            </div>
                          )}

                          {/* Buttons */}
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button type="button" variant="secondary" onClick={cancelEditingTask}>
                              Anuloni
                            </Button>
                            <Button type="submit" variant="primary" loading={saving}>
                              Ruaj ndryshimet
                            </Button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
