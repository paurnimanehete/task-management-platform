import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  Hourglass,
  ListTodo,
  AlertTriangle,
  CalendarClock,
  TrendingUp,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { format } from 'date-fns';

const StatCard = ({ icon: Icon, label, value, description, iconBg, iconColor, loading }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    {loading ? (
      <div className="space-y-2 animate-pulse">
        <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800/60 rounded" />
      </div>
    ) : (
      <>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">{value ?? 0}</p>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
        {description && <p className="text-[11px] text-slate-400 mt-1">{description}</p>}
      </>
    )}
  </div>
);

const STATUS_COLORS = {
  Pending: '#94a3b8',
  'In Progress': '#3b82f6',
  Completed: '#22c55e',
};

const PRIORITY_COLORS = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#22c55e',
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const { stats, recentTasks, statsLoading, getStats } = useTasks();

  useEffect(() => {
    getStats();
  }, []);

  // Memoized chart data
  const statusChartData = useMemo(
    () => [
      { name: 'Pending', value: stats.pendingTasks, color: STATUS_COLORS.Pending },
      { name: 'In Progress', value: stats.inProgressTasks, color: STATUS_COLORS['In Progress'] },
      { name: 'Completed', value: stats.completedTasks, color: STATUS_COLORS.Completed },
    ],
    [stats.pendingTasks, stats.inProgressTasks, stats.completedTasks]
  );

  const priorityChartData = useMemo(
    () => [
      { name: 'High', count: stats.priorityBreakdown?.high ?? 0, fill: PRIORITY_COLORS.High },
      { name: 'Medium', count: stats.priorityBreakdown?.medium ?? 0, fill: PRIORITY_COLORS.Medium },
      { name: 'Low', count: stats.priorityBreakdown?.low ?? 0, fill: PRIORITY_COLORS.Low },
    ],
    [stats.priorityBreakdown]
  );

  const statCards = [
    {
      icon: ListTodo,
      label: 'Total Tasks',
      value: stats.totalTasks,
      description: 'Across all team members',
      iconBg: 'bg-blue-50 dark:bg-blue-950/50',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: Hourglass,
      label: 'Pending',
      value: stats.pendingTasks,
      description: 'Waiting to be started',
      iconBg: 'bg-slate-100 dark:bg-slate-800',
      iconColor: 'text-slate-600 dark:text-slate-400',
    },
    {
      icon: Clock,
      label: 'In Progress',
      value: stats.inProgressTasks,
      description: 'Currently being worked on',
      iconBg: 'bg-amber-50 dark:bg-amber-950/50',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      icon: CheckSquare,
      label: 'Completed',
      value: stats.completedTasks,
      description: `${stats.completionRate ?? 0}% completion rate`,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: AlertTriangle,
      label: 'Overdue',
      value: stats.overdueTasks,
      description: 'Past due date, not completed',
      iconBg: 'bg-red-50 dark:bg-red-950/50',
      iconColor: 'text-red-600 dark:text-red-400',
    },
    {
      icon: CalendarClock,
      label: 'Due This Week',
      value: stats.upcomingTasks,
      description: 'Tasks due in next 7 days',
      iconBg: 'bg-purple-50 dark:bg-purple-950/50',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Here's what's happening with your team today.
          </p>
        </div>
        <Link
          to="/tasks"
          className="hidden sm:flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          View all tasks <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} loading={statsLoading} />
        ))}
      </div>

      {/* Charts + Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Status Pie Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Status Breakdown</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                  labelLine={false}
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-card, #fff)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {statusChartData.map(({ name, color }) => (
              <div key={name} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                {name}
              </div>
            ))}
          </div>
        </div>

        {/* Priority Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Priority Breakdown</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityChartData} barSize={32}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f1f5f9',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {priorityChartData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Rate Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckSquare className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Completion Rate</h3>
            </div>
            <p className="text-5xl font-bold text-slate-900 dark:text-white">
              {stats.completionRate ?? 0}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {stats.completedTasks} of {stats.totalTasks} tasks completed
            </p>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${stats.completionRate ?? 0}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-amber-50 dark:bg-amber-950/40 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{stats.overdueTasks}</p>
              <p className="text-[10px] text-amber-600/70 dark:text-amber-500 font-medium">Overdue</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/40 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{stats.upcomingTasks}</p>
              <p className="text-[10px] text-purple-600/70 dark:text-purple-500 font-medium">Due Soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Recent Tasks</h3>
          <Link
            to="/tasks"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500">
            <ListTodo className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">No tasks yet.</p>
            <p className="text-xs mt-0.5">Create your first task to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {['Task', 'Status', 'Priority', 'Due Date', 'Assigned To'].map((h) => (
                    <th key={h} className="py-2.5 px-4 text-left text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentTasks.slice(0, 5).map((task) => (
                  <tr key={task._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-[200px]">
                      <Link to={`/tasks`} className="hover:text-blue-600 dark:hover:text-blue-400 truncate block">
                        {task.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4"><StatusBadge status={task.status} /></td>
                    <td className="py-3 px-4"><PriorityBadge priority={task.priority} /></td>
                    <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                      {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-[9px] font-bold flex items-center justify-center">
                          {task.assignedUser?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="truncate max-w-[80px]">{task.assignedUser?.name || '—'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
