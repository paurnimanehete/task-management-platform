import React, { useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { format } from 'date-fns';
import {
  User,
  Mail,
  Calendar,
  CheckSquare,
  Clock,
  Hourglass,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { Link } from 'react-router-dom';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { stats, recentTasks, getStats, statsLoading } = useTasks();

  useEffect(() => {
    getStats();
  }, []);

  const initials = useMemo(() => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [user?.name]);

  const infoItems = [
    { icon: User, label: 'Full Name', value: user?.name },
    { icon: Mail, label: 'Email Address', value: user?.email },
    { icon: Shield, label: 'Role', value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Member' },
    { icon: Calendar, label: 'Member Since', value: user?.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : '—' },
  ];

  const statCards = [
    { icon: CheckSquare, label: 'Total', value: stats.totalTasks, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/50' },
    { icon: Hourglass, label: 'Pending', value: stats.pendingTasks, color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-800' },
    { icon: Clock, label: 'In Progress', value: stats.inProgressTasks, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/50' },
    { icon: CheckSquare, label: 'Completed', value: stats.completedTasks, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/50' },
    { icon: AlertTriangle, label: 'Overdue', value: stats.overdueTasks, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/50' },
    { icon: Calendar, label: 'My Assigned', value: stats.myAssignedTasks, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/50' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile & Account</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your profile and view your task performance stats.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            {/* Avatar */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3">
                {initials}
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{user?.name}</h2>
              <span className="inline-flex items-center gap-1 mt-1 px-3 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                <Shield className="w-3 h-3" />
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Member'}
              </span>
            </div>

            {/* Info list */}
            <div className="space-y-3">
              {infoItems.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
                    <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{value || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats + Recent Activity */}
        <div className="lg:col-span-2 space-y-5">
          {/* Stats Grid */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Task Performance (Team-wide)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {statCards.map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className={`${bg} rounded-xl p-4`}>
                  <Icon className={`w-5 h-5 ${color} mb-2`} />
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{statsLoading ? '…' : (value ?? 0)}</p>
                  <p className={`text-xs font-semibold ${color} mt-0.5`}>{label}</p>
                </div>
              ))}
            </div>

            {/* Completion Progress */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Completion Rate</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{stats.completionRate ?? 0}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                <div
                  className="h-2.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${stats.completionRate ?? 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Recent Task Activity */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Recent Activity</h3>
              <Link to="/tasks" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">View all</Link>
            </div>
            {recentTasks.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="text-sm">No recent tasks found.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentTasks.slice(0, 5).map((task) => (
                  <div key={task._id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{task.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '—'}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <StatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
