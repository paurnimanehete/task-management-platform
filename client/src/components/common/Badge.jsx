import React from 'react';
import { AlertCircle, Clock, CheckCircle2, ShieldAlert, AlertTriangle, ArrowDown } from 'lucide-react';

export const PriorityBadge = React.memo(({ priority, className = '' }) => {
  const configs = {
    High: {
      bg: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60',
      dot: 'bg-red-500',
      icon: ShieldAlert,
    },
    Medium: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
      dot: 'bg-amber-500',
      icon: AlertTriangle,
    },
    Low: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
      dot: 'bg-emerald-500',
      icon: ArrowDown,
    },
  };

  const config = configs[priority] || configs.Medium;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{priority}</span>
    </span>
  );
});

PriorityBadge.displayName = 'PriorityBadge';

export const StatusBadge = React.memo(({ status, className = '' }) => {
  const configs = {
    'Completed': {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
      icon: CheckCircle2,
      dot: 'bg-emerald-500',
    },
    'In Progress': {
      bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
      icon: Clock,
      dot: 'bg-blue-500 animate-pulse',
    },
    'Pending': {
      bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      icon: AlertCircle,
      dot: 'bg-slate-400',
    },
  };

  const config = configs[status] || configs.Pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      <span>{status}</span>
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

export default { PriorityBadge, StatusBadge };
