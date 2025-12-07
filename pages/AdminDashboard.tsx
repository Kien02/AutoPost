import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { UserRole, LogEntry } from '../types';
import { MOCK_USERS } from '../services/mockData';
import { Users, Activity, Terminal, Shield } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { logs, auth } = useStore();
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');

  if (auth.user?.role !== UserRole.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <Shield size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Admin Console</h2>
          <p className="text-slate-500 text-sm">System oversight and user management</p>
        </div>
        
        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
              activeTab === 'users' 
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Users size={16} />
            <span>Users</span>
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
              activeTab === 'logs' 
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Terminal size={16} />
            <span>System Logs</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {activeTab === 'users' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">User</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">API Key Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {MOCK_USERS.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                         <img src={user.avatarUrl} className="w-8 h-8 rounded-full" alt="" />
                         <div>
                           <div className="font-medium text-slate-800 dark:text-white">{user.name}</div>
                           <div className="text-xs text-slate-500">{user.email}</div>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      <span className="flex items-center space-x-1 text-green-600">
                        <Activity size={14} />
                        <span>Configured</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-sm text-slate-500 hover:text-primary-600 font-medium">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <div className="p-4 bg-slate-900 text-slate-200 font-mono text-sm h-[500px] overflow-y-auto">
               {logs.map((log) => (
                 <div key={log.id} className="mb-2 border-b border-slate-800 pb-2 last:border-0">
                   <div className="flex space-x-2 opacity-75 text-xs mb-1">
                     <span className="text-blue-400">[{new Date(log.timestamp).toISOString()}]</span>
                     <span className={log.status === 'error' ? 'text-red-400' : 'text-green-400'}>{log.status.toUpperCase()}</span>
                     <span>{log.action}</span>
                   </div>
                   <div className="pl-4 text-slate-300">
                     {log.details}
                   </div>
                 </div>
               ))}
               {logs.length === 0 && <div className="text-slate-500 italic">No logs available.</div>}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};