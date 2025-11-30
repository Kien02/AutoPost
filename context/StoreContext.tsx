import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Post, MediaItem, LogEntry, AuthState, UserRole } from '../types';
import { MOCK_USERS, INITIAL_POSTS, INITIAL_MEDIA, INITIAL_LOGS } from '../services/mockData';

interface StoreContextType {
  // Auth
  auth: AuthState;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  
  // Data
  posts: Post[];
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  deletePost: (id: string) => void;
  
  media: MediaItem[];
  uploadMedia: (file: File) => void;
  
  logs: LogEntry[];
  addLog: (log: LogEntry) => void;

  // UI
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Auth State
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null,
  });

  // Data State
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [media, setMedia] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);

  // Init Theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const login = (email: string, role: UserRole) => {
    const user = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[1];
    setAuth({
      user,
      isAuthenticated: true,
      token: 'mock-jwt-token-123'
    });
    addLog({
      id: Date.now().toString(),
      action: 'Login',
      status: 'success',
      details: `User ${user.email} logged in`,
      timestamp: new Date().toISOString()
    });
  };

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false, token: null });
  };

  const addPost = (post: Post) => {
    setPosts(prev => [post, ...prev]);
    addLog({
      id: Date.now().toString(),
      action: 'Create Post',
      status: 'success',
      details: `Created post: ${post.title}`,
      timestamp: new Date().toISOString()
    });
  };

  const updatePost = (updatedPost: Post) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const uploadMedia = (file: File) => {
    // Mock upload
    const newItem: MediaItem = {
      id: Date.now().toString(),
      url: URL.createObjectURL(file), // Local blob for preview
      name: file.name,
      type: file.type.startsWith('video') ? 'video' : 'image',
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedAt: new Date().toISOString()
    };
    setMedia(prev => [newItem, ...prev]);
  };

  const addLog = (log: LogEntry) => {
    setLogs(prev => [log, ...prev]);
  };

  return (
    <StoreContext.Provider value={{
      auth, login, logout,
      posts, addPost, updatePost, deletePost,
      media, uploadMedia,
      logs, addLog,
      isDarkMode, toggleTheme
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};