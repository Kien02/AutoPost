import { User, UserRole, Post, PostStatus, MediaItem, LogEntry } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    email: 'admin@fangage.com',
    name: 'Admin User',
    role: UserRole.ADMIN,
    avatarUrl: 'https://picsum.photos/seed/admin/200/200'
  },
  {
    id: 'u2',
    email: 'creator@fangage.com',
    name: 'Jane Creator',
    role: UserRole.USER,
    avatarUrl: 'https://picsum.photos/seed/jane/200/200'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u2',
    title: 'New Merch Drop!',
    content: 'Check out the new summer collection dropping this Friday. #summer #vibes',
    status: PostStatus.PUBLISHED,
    scheduledAt: new Date(Date.now() - 86400000).toISOString(),
    tags: ['summer', 'merch'],
    mediaUrls: ['https://picsum.photos/seed/merch/800/600'],
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'p2',
    userId: 'u2',
    title: 'Weekly Vlog Teaser',
    content: 'Editing the new vlog. It is going to be insane.',
    status: PostStatus.SCHEDULED,
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    tags: ['vlog', 'bts'],
    mediaUrls: ['https://picsum.photos/seed/vlog/800/600'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'p3',
    userId: 'u2',
    title: 'Draft Idea: Q&A',
    content: 'Thinking of doing a live Q&A next week. Leave questions below!',
    status: PostStatus.DRAFT,
    scheduledAt: null,
    tags: ['qna', 'live'],
    mediaUrls: [],
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_MEDIA: MediaItem[] = [
  { id: 'm1', url: 'https://picsum.photos/seed/1/400/400', name: 'img_001.jpg', type: 'image', size: '2.4 MB', uploadedAt: '2023-10-01' },
  { id: 'm2', url: 'https://picsum.photos/seed/2/400/400', name: 'img_002.jpg', type: 'image', size: '1.8 MB', uploadedAt: '2023-10-02' },
  { id: 'm3', url: 'https://picsum.photos/seed/3/400/400', name: 'video_teaser.mp4', type: 'video', size: '15.2 MB', uploadedAt: '2023-10-05' },
];

export const INITIAL_LOGS: LogEntry[] = [
  { id: 'l1', action: 'System Backup', status: 'success', details: 'Database backup completed successfully.', timestamp: new Date(Date.now() - 10000000).toISOString() },
  { id: 'l2', action: 'Post Publish', status: 'error', details: 'Failed to publish Post #p4 due to API timeout.', timestamp: new Date(Date.now() - 5000000).toISOString() },
  { id: 'l3', action: 'User Login', status: 'success', details: 'User u2 logged in.', timestamp: new Date(Date.now() - 100000).toISOString() },
];