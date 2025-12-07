import React from 'react';
import { useStore } from '../context/StoreContext';
import { PostStatus } from '../types';
import { Clock, MoreVertical, Trash2, Edit2 } from 'lucide-react';

export const Schedule: React.FC = () => {
  const { posts, deletePost } = useStore();

  const scheduledPosts = posts
    .filter(p => p.status === PostStatus.SCHEDULED || p.status === PostStatus.PUBLISHED)
    .sort((a, b) => new Date(a.scheduledAt || 0).getTime() - new Date(b.scheduledAt || 0).getTime());

  const getStatusColor = (status: PostStatus) => {
    switch(status) {
      case PostStatus.PUBLISHED: return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case PostStatus.SCHEDULED: return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case PostStatus.FAILED: return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Content Schedule</h2>
        <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
           <button className="px-4 py-1.5 text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-md shadow-sm">List</button>
           <button className="px-4 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">Calendar</button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Content</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {scheduledPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {new Date(post.scheduledAt!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(post.scheduledAt!).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 rounded bg-slate-200 dark:bg-slate-700 flex-shrink-0 overflow-hidden">
                         {post.mediaUrls.length > 0 && <img src={post.mediaUrls[0]} className="w-full h-full object-cover" alt="" />}
                       </div>
                       <div className="max-w-xs">
                         <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{post.title}</p>
                         <p className="text-xs text-slate-500 truncate">{post.content}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                       {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1">
                       Fangage
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deletePost(post.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {scheduledPosts.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Clock size={48} className="mx-auto mb-4 opacity-20" />
              <p>No posts scheduled. Go create one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};