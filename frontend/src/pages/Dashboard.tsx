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
import {
  CreateTaskInput,
  Task,
  TaskPriority,
  TaskStatus,
  UpdateTaskInput,
} from '../types';
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
        const matchesStatus =
          filterStatus === 'all' || task.status === filterStatus;

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

        return (
          new Date(a.dueDate || '9999-12-31').getTime() -
          new Date(b.dueDate || '9999-12-31').getTime()
        );
      });
  }, [filterStatus, searchTerm, sortBy, tasks]);

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const overdue = tasks.filter(
      (t) => t.status !== 'completed' && t.dueDate && t.dueDate < today
    ).length;

    return [
      { label: 'Totali', value: tasks.length, accent: 'from-pink-400 to-pink-600' },
      { label: 'Të Përfunduara', value: completed, accent: 'from-green-400 to-green-600' },
      { label: 'Në Progres', value: inProgress, accent: 'from-blue-400 to-blue-600' },
      { label: 'Të pa Përfunduara', value: overdue, accent: 'from-red-400 to-red-600' },
    ];
  }, [tasks]);

  const handleDraftChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = event.target;

    if (name === 'endTime' && draftTask.startTime) {
      setTimeError(isEndTimeValid(draftTask.startTime, value) ? '' : 'End time must be after start time');
    } else if (name === 'startTime' && draftTask.endTime) {
      setTimeError(isEndTimeValid(value, draftTask.endTime) ? '' : 'End time must be after start time');
    }

    setDraftTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
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

  const handleCreateTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      const created = await taskService.createTask(draftTask);
      setTasks((prev) => [created, ...prev]);
      setDraftTask(emptyTask);
      setShowCreateForm(false);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create task.'));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTask = async (event: React.FormEvent<HTMLFormElement>, task: Task) => {
    event.preventDefault();

    try {
      setSaving(true);

      const updated = await taskService.updateTask(task.id, {
        ...editTask,
      });

      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      cancelEditingTask();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update task.'));
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteTask = async (id: number) => {
    try {
      const updated = await taskService.markTaskComplete(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to complete task.'));
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!window.confirm('Dëshironi të fshini këtë detyrë?')) return;

    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete task.'));
    }
  };

  return (
    <div className="dashboard-floral-bg relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">

        <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} className="panel-glass rounded-lg p-4">
              <div className={`mb-3 h-1.5 w-16 rounded-full bg-gradient-to-r ${stat.accent}`} />
              <p className="text-sm font-medium text-slate-300">{stat.label}</p>
              <p className="mt-1 text-3xl font-black text-white">{stat.value}</p>
            </motion.div>
          ))}
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
