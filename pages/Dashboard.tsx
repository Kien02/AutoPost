import React from 'react';
import { useStore } from '../context/StoreContext';
import { PostStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { posts } = useStore();

  const stats = [
    { 
      label: 'Scheduled', 
      value: posts.filter(p => p.status === PostStatus.SCHEDULED).length,
      icon: Clock,
      color: 'bg-blue-500'
    },
    { 
      label: 'Published', 
      value: posts.filter(p => p.status === PostStatus.PUBLISHED).length,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    { 
      label: 'Drafts', 
      value: posts.filter(p => p.status === PostStatus.DRAFT).length,
      icon: FileText,
      color: 'bg-slate-500'
    },
    { 
      label: 'Errors', 
      value: posts.filter(p => p.status === PostStatus.FAILED).length,
      icon: AlertCircle,
      color: 'bg-red-500'
    },
  ];

  const chartData = [
    { name: 'Mon', posts: 4 },
    { name: 'Tue', posts: 3 },
    { name: 'Wed', posts: 7 },
    { name: 'Thu', posts: 2 },
    { name: 'Fri', posts: 6 },
    { name: 'Sat', posts: 8 },
    { name: 'Sun', posts: 5 },
  ];

  const upcomingPosts = posts
    .filter(p => p.status === PostStatus.SCHEDULED)
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome back!</h2>
        <p className="text-slate-500 dark:text-slate-400">Here's what's happening with your content today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between hover:shadow-md transition-shadow">
             <div>
               <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
               <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stat.value}</p>
             </div>
             <div className={`${stat.color} p-3 rounded-lg text-white opacity-80`}>
               <stat.icon size={24} />
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Posting Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="posts" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#6366f1" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming List */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Upcoming</h3>
             <Link to="/schedule" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</Link>
          </div>
          
          <div className="space-y-4">
            {upcomingPosts.length === 0 ? (
              <p className="text-slate-400 text-center py-4">No posts scheduled.</p>
            ) : (
              upcomingPosts.map(post => (
                <div key={post.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-slate-100 dark:border-slate-700/50">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-md overflow-hidden flex-shrink-0">
                    {post.mediaUrls.length > 0 ? (
                      <img src={post.mediaUrls[0]} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <FileText size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-800 dark:text-slate-200 truncate">{post.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {new Date(post.scheduledAt!).toLocaleDateString()} at {new Date(post.scheduledAt!).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                </div>
              ))
            )}
          </div>
          
          <Link to="/posts" className="mt-6 block w-full py-2 px-4 bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400 text-center rounded-lg text-sm font-medium hover:bg-primary-100 dark:hover:bg-slate-600 transition-colors">
            + Create New Post
          </Link>
        </div>
      </div>
    </div>
  );
};