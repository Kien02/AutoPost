import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PenTool, 
  Calendar, 
  Image as ImageIcon, 
  Settings, 
  ShieldAlert, 
  LogOut, 
  Menu, 
  X,
  Moon,
  Sun,
  Bell
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth, logout, isDarkMode, toggleTheme } = useStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <NavLink
      to={to}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-primary-600 text-white shadow-lg' 
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`
      }
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-200">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col`}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-primary-500 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">Fangage</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">Menu</div>
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/posts" icon={PenTool} label="Posts & Drafts" />
          <NavItem to="/schedule" icon={Calendar} label="Schedule" />
          <NavItem to="/media" icon={ImageIcon} label="Media Library" />
          
          <div className="mt-8 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">System</div>
          <NavItem to="/settings" icon={Settings} label="Settings" />
          {auth.user?.role === UserRole.ADMIN && (
             <NavItem to="/admin" icon={ShieldAlert} label="Admin Panel" />
          )}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-2 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300"
          >
            <Menu size={24} />
          </button>
          
          <h1 className="text-lg font-semibold text-slate-800 dark:text-white capitalize hidden sm:block">
            {location.pathname.replace('/', '') || 'Dashboard'}
          </h1>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-700 pl-4">
               <img 
                 src={auth.user?.avatarUrl} 
                 alt="Profile" 
                 className="w-8 h-8 rounded-full bg-slate-200"
               />
               <div className="hidden md:block text-sm">
                 <p className="font-medium text-slate-700 dark:text-slate-200">{auth.user?.name}</p>
                 <p className="text-slate-400 text-xs capitalize">{auth.user?.role.toLowerCase()}</p>
               </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
           {children}
        </div>
      </main>
    </div>
  );
};