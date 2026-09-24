import React from 'react';
import { format } from 'date-fns';
import { X, Edit2, Trash2, Calendar, User, Clock, Flag, AlignLeft } from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../common/Badge';

const InfoRow = ({ icon: Icon, label, value, valueClass = '' }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">{label}</p>
      <div className={`text-sm font-medium text-slate-800 dark:text-slate-200 ${valueClass}`}>{value}</div>
    </div>
  </div>
);

export const TaskDetailView = ({ task, onClose, onEdit, onDelete, currentUserId }) => {
  if (!task) return null;

  const isCreator =
    task.createdBy?._id === currentUserId || task.createdBy === currentUserId;

  return (
    <div>
      {/* Header badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
        {isCreator && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-medium">
            Created by you
          </span>
        )}
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
        {task.title}
      </h2>

      {/* Info Grid */}
      <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 px-4 mb-4">
        <InfoRow
          icon={AlignLeft}
          label="Description"
          value={task.description || 'No description provided.'}
        />
        <InfoRow
          icon={Flag}
          label="Priority"
          value={<PriorityBadge priority={task.priority} />}
        />
        <InfoRow
          icon={Clock}
          label="Status"
          value={<StatusBadge status={task.status} />}
        />
        <InfoRow
          icon={Calendar}
          label="Due Date"
          value={
            task.dueDate
              ? format(new Date(task.dueDate), 'EEEE, MMMM d, yyyy')
              : 'No due date'
          }
        />
        <InfoRow
          icon={User}
          label="Assigned To"
          value={
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">
                {task.assignedUser?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span>{task.assignedUser?.name || 'Unassigned'}</span>
              <span className="text-slate-400 text-xs">({task.assignedUser?.email})</span>
            </div>
          }
        />
        <InfoRow
          icon={User}
          label="Created By"
          value={
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center">
                {task.createdBy?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span>{task.createdBy?.name || 'Unknown'}</span>
            </div>
          }
        />
        <InfoRow
          icon={Calendar}
          label="Created At"
          value={
            task.createdAt
              ? format(new Date(task.createdAt), 'PPp')
              : '—'
          }
        />
        {task.updatedAt && task.updatedAt !== task.createdAt && (
          <InfoRow
            icon={Calendar}
            label="Last Updated"
            value={format(new Date(task.updatedAt), 'PPp')}
          />
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <Edit2 className="w-4 h-4 text-blue-500" />
          Edit Task
        </button>
        <button
          onClick={() => onDelete(task)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/60 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskDetailView;
