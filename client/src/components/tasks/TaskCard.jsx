import React, { useState, useRef, useEffect, useCallback } from 'react';
import { format, isPast, isToday } from 'date-fns';
import {
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../common/Badge';

export const TaskCard = React.memo(({
  task,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  currentUserId,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && task.status !== 'Completed';
  const isDueToday = dueDate && isToday(dueDate) && task.status !== 'Completed';

  const isCreator = task.createdBy?._id === currentUserId || task.createdBy === currentUserId;
  const isAssigned = task.assignedUser?._id === currentUserId || task.assignedUser === currentUserId;

  const handleStatusClick = useCallback(
    (newStatus) => {
      if (onStatusChange && newStatus !== task.status) {
        onStatusChange(task._id, newStatus);
      }
    },
    [onStatusChange, task._id, task.status]
  );

  return (
    <div className="group relative flex flex-col justify-between rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200">
      {/* Top row: Badges and Action Menu */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>

          {/* Action Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Task options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-36 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-20 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onView(task);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(task);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Edit Task</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(task);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Task</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h4
          onClick={() => onView(task)}
          className="text-base font-semibold text-slate-900 dark:text-white line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
          title={task.title}
        >
          {task.title}
        </h4>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 min-h-[32px]">
          {task.description || 'No description provided.'}
        </p>
      </div>

      {/* Bottom Metadata & Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
        {/* Due date & Assigned User */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div
            className={`flex items-center gap-1.5 font-medium ${
              isOverdue
                ? 'text-red-600 dark:text-red-400 font-semibold'
                : isDueToday
                ? 'text-amber-600 dark:text-amber-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
            title={dueDate ? format(dueDate, 'PPP') : 'No due date'}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {isOverdue && 'Overdue: '}
              {isDueToday && 'Today: '}
              {dueDate ? format(dueDate, 'MMM d, yyyy') : 'No date'}
            </span>
          </div>

          {/* Assigned User Avatar */}
          <div
            className="flex items-center gap-1.5"
            title={`Assigned to ${task.assignedUser?.name || 'Unassigned'}`}
          >
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold flex items-center justify-center">
              {task.assignedUser?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-xs truncate max-w-[80px]">
              {task.assignedUser?.name || 'Unassigned'}
            </span>
          </div>
        </div>

        {/* Quick Status Bar */}
        <div className="grid grid-cols-3 gap-1 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => handleStatusClick('Pending')}
            className={`py-1 text-[11px] font-medium rounded transition-colors ${
              task.status === 'Pending'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Pending
          </button>
          <button
            type="button"
            onClick={() => handleStatusClick('In Progress')}
            className={`py-1 text-[11px] font-medium rounded transition-colors ${
              task.status === 'In Progress'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            In Progress
          </button>
          <button
            type="button"
            onClick={() => handleStatusClick('Completed')}
            className={`py-1 text-[11px] font-medium rounded transition-colors ${
              task.status === 'Completed'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;
