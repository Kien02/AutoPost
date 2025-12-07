export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  fangageApiKey?: string;
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  FAILED = 'FAILED'
}

export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  status: PostStatus;
  scheduledAt: string | null; // ISO Date string
  tags: string[];
  mediaUrls: string[];
  createdAt: string;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video';
  size: string;
  uploadedAt: string;
}

export interface LogEntry {
  id: string;
  action: string;
  status: 'success' | 'error' | 'warning';
  details: string;
  timestamp: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}