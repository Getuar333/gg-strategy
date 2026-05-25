import axiosInstance, { clearAccessToken, setAccessToken } from '../lib/axios';
import {
  AuthResponse,
  CreateNoteInput,
  CreateTaskInput,
  Note,
  NoteType,
  Task,
  TaskPriority,
  TaskStatus,
  UpdateNoteInput,
  UpdateTaskInput,
  User,
} from '../types';

type ApiUser = {
  id: number;
  email: string;
  fullName?: string;
  full_name?: string;
  avatar?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
};

type ApiAuthResponse = {
  token: string;
  message: string;
  user: ApiUser;
};

type ApiTask = {
  id: number;
  user_id?: number;
  userId?: number;
  title: string;
  description?: string | null;
  status?: string | null;
  priority?: string | null;
  category?: string | null;
  due_date?: string | null;
  dueDate?: string | null;
  start_time?: string | null;
  startTime?: string | null;
  end_time?: string | null;
  endTime?: string | null;
  color_label?: string | null;
  colorLabel?: string | null;
  created_at?: string | null;
  createdAt?: string | null;
  updated_at?: string | null;
  updatedAt?: string | null;
};

type ApiNote = {
  id: number;
  user_id?: number;
  userId?: number;
  title: string;
  content?: string | null;
  type?: string | null;
  tags?: string[] | string | null;
  color?: string | null;
  created_at?: string | null;
  createdAt?: string | null;
  updated_at?: string | null;
  updatedAt?: string | null;
};

const normalizeUser = (user: ApiUser): User => ({
  id: user.id,
  email: user.email,
  fullName: user.fullName || user.full_name || 'User',
  avatar: user.avatar,
  createdAt: user.createdAt || user.created_at,
  updatedAt: user.updatedAt || user.updated_at,
});

const normalizeTaskStatus = (status?: string | null): TaskStatus => {
  if (status === 'in-progress') {
    return 'in_progress';
  }

  if (status === 'pending' || status === 'in_progress' || status === 'completed' || status === 'cancelled') {
    return status;
  }

  return 'pending';
};

const normalizeTaskPriority = (priority?: string | null): TaskPriority => {
  if (priority === 'low' || priority === 'medium' || priority === 'high') {
    return priority;
  }

  return 'medium';
};

const normalizeTask = (task: ApiTask): Task => ({
  id: task.id,
  userId: task.userId || task.user_id || 0,
  title: task.title,
  description: task.description || '',
  status: normalizeTaskStatus(task.status),
  priority: normalizeTaskPriority(task.priority),
  category: task.category || 'general',
  dueDate: task.dueDate || task.due_date || '',
  startTime: task.startTime || task.start_time || null,
  endTime: task.endTime || task.end_time || null,
  colorLabel: task.colorLabel || task.color_label || '#e11d48',
  createdAt: task.createdAt || task.created_at || '',
  updatedAt: task.updatedAt || task.updated_at || '',
});

const normalizeNoteType = (type?: string | null): NoteType => {
  if (type === 'bookmark' || type === 'idea' || type === 'reminder') {
    return type;
  }

  return 'note';
};

const normalizeTags = (tags?: string[] | string | null): string[] => {
  if (Array.isArray(tags)) {
    return tags;
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeNote = (note: ApiNote): Note => ({
  id: note.id,
  userId: note.userId || note.user_id || 0,
  title: note.title,
  content: note.content || '',
  type: normalizeNoteType(note.type),
  tags: normalizeTags(note.tags),
  color: note.color || '#e11d48',
  createdAt: note.createdAt || note.created_at || '',
  updatedAt: note.updatedAt || note.updated_at || '',
});

const serializeNote = (data: CreateNoteInput | UpdateNoteInput) => ({
  ...data,
  tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags,
});

const normalizeAuthResponse = (data: ApiAuthResponse): AuthResponse => {
  setAccessToken(data.token);

  return {
    token: data.token,
    message: data.message,
    user: normalizeUser(data.user),
  };
};

export const authService = {
  async register(
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<AuthResponse> {
    const response = await axiosInstance.post<ApiAuthResponse>('/auth/register', {
      fullName,
      email,
      password,
      confirmPassword,
    });

    return normalizeAuthResponse(response.data);
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axiosInstance.post<ApiAuthResponse>('/auth/login', {
      email,
      password,
    });

    return normalizeAuthResponse(response.data);
  },

  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      clearAccessToken();
    }
  },

  async refreshToken(): Promise<string> {
    const response = await axiosInstance.post<{ token: string }>('/auth/refresh');
    setAccessToken(response.data.token);
    return response.data.token;
  },

  async getProfile(): Promise<User> {
    const response = await axiosInstance.get<{ user: ApiUser }>('/auth/me');
    return normalizeUser(response.data.user);
  },

  async updateProfile(fullName: string, email: string): Promise<User> {
    const response = await axiosInstance.put<{ user: ApiUser }>('/auth/profile', {
      fullName,
      email,
    });

    return normalizeUser(response.data.user);
  },
};

export const taskService = {
  async createTask(data: CreateTaskInput): Promise<Task> {
    const response = await axiosInstance.post<{ task: ApiTask }>('/tasks', data);
    return normalizeTask(response.data.task);
  },

  async getTasks(): Promise<Task[]> {
    const response = await axiosInstance.get<{ tasks: ApiTask[] }>('/tasks');
    return (response.data.tasks || []).map(normalizeTask);
  },

  async getTaskById(id: number): Promise<Task> {
    const response = await axiosInstance.get<{ task: ApiTask }>(`/tasks/${id}`);
    return normalizeTask(response.data.task);
  },

  async updateTask(id: number, data: UpdateTaskInput): Promise<Task> {
    const response = await axiosInstance.put<{ task: ApiTask }>(`/tasks/${id}`, data);
    return normalizeTask(response.data.task);
  },

  async deleteTask(id: number): Promise<void> {
    await axiosInstance.delete(`/tasks/${id}`);
  },

  async getTasksByDate(date: string): Promise<Task[]> {
    const response = await axiosInstance.get<{ tasks: ApiTask[] }>(`/tasks/date/${date}`);
    return (response.data.tasks || []).map(normalizeTask);
  },

  async getUpcomingTasks(): Promise<Task[]> {
    const response = await axiosInstance.get<{ tasks: ApiTask[] }>('/tasks/upcoming');
    return (response.data.tasks || []).map(normalizeTask);
  },

  async getTasksByDateRange(startDate: string, endDate: string): Promise<Task[]> {
    const response = await axiosInstance.get<{ tasks: ApiTask[] }>('/tasks/range', {
      params: { startDate, endDate },
    });
    return (response.data.tasks || []).map(normalizeTask);
  },

  async markTaskComplete(id: number): Promise<Task> {
    const response = await axiosInstance.patch<{ task: ApiTask }>(`/tasks/${id}/complete`);
    return normalizeTask(response.data.task);
  },
};

export const noteService = {
  async createNote(data: CreateNoteInput): Promise<Note> {
    const response = await axiosInstance.post<{ note: ApiNote }>('/notes', serializeNote(data));
    return normalizeNote(response.data.note);
  },

  async getNotes(): Promise<Note[]> {
    const response = await axiosInstance.get<{ notes: ApiNote[] }>('/notes');
    return (response.data.notes || []).map(normalizeNote);
  },

  async getNoteById(id: number): Promise<Note> {
    const response = await axiosInstance.get<{ note: ApiNote }>(`/notes/${id}`);
    return normalizeNote(response.data.note);
  },

  async updateNote(id: number, data: UpdateNoteInput): Promise<Note> {
    const response = await axiosInstance.put<{ note: ApiNote }>(`/notes/${id}`, serializeNote(data));
    return normalizeNote(response.data.note);
  },

  async deleteNote(id: number): Promise<void> {
    await axiosInstance.delete(`/notes/${id}`);
  },

  async searchNotes(query: string): Promise<Note[]> {
    const response = await axiosInstance.get<{ notes: ApiNote[] }>('/notes/search', {
      params: { q: query },
    });
    return (response.data.notes || []).map(normalizeNote);
  },
};
