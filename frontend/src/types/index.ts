// ==================== USER TYPES ====================
export interface User {
  id: number;
  email: string;
  fullName: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

// ==================== TASK TYPES ====================
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  dueDate: string;
  startTime?: string | null;
  endTime?: string | null;
  colorLabel?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: TaskPriority;
  category?: string;
  dueDate: string;
  startTime?: string | null;
  endTime?: string | null;
  colorLabel?: string;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  status?: TaskStatus;
}

// ==================== NOTE TYPES ====================
export type NoteType = 'note' | 'bookmark' | 'idea' | 'reminder';

export interface Note {
  id: number;
  userId: number;
  title: string;
  content: string;
  type: NoteType;
  tags?: string[];
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  type: NoteType;
  tags?: string[];
  color?: string;
}

export interface UpdateNoteInput extends Partial<CreateNoteInput> {}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiErrorResponse {
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
}

// ==================== CONTEXT TYPES ====================
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  register: (fullName: string, email: string, password: string, confirmPassword: string) => Promise<AuthResponse>;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}
