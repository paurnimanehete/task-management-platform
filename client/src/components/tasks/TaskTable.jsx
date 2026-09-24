import React from 'react';
import { format, isPast, isToday } from 'date-fns';
import { Edit2, Trash2, Eye, ArrowUpDown } from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { TableRowSkeleton } from '../common/LoadingSpinner';

export const TaskTable = React.memo(({
  tasks,
  loading,
  sortBy,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onDelete,
  currentUserId,
}) => {
  const SortableHeader = ({ field, label }) => (
    <th
      scope="col"
      className="py-3 px-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 select-none group"
      onClick={() => onSort(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`w-3.5 h-3.5 transition-opacity ${
          sortBy === field ? 'text-blue-600 dark:text-blue-400 opacity-100' : 'opacity-0 group-hover:opacity-60'
        }`} />
        {sortBy === field && (
          <span className="text-[9px] text-blue-600 dark:text-blue-400 ml-0.5">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </span>
    </th>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" aria-label="Task list table">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <SortableHeader field="title" label="Task" />
              <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <SortableHeader field="priority" label="Priority" />
              <SortableHeader field="dueDate" label="Due Date" />
              <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assigned To</th>
              <th scope="col" className="py-3 px-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
              : tasks.map((task) => {
                  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && task.status !== 'Completed';
                  return (
                    <tr
                      key={task._id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-[200px]">
                        <button
                          onClick={() => onView(task)}
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block max-w-full text-left"
                          title={task.title}
                        >
                          {task.title}
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="py-3.5 px-4">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className={`py-3.5 px-4 text-xs font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {dueDate ? format(dueDate, 'MMM d, yyyy') : '—'}
                        {isOverdue && <span className="ml-1 text-red-500">(Overdue)</span>}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {task.assignedUser?.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <span className="truncate max-w-[80px]">{task.assignedUser?.name || 'Unassigned'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onView(task)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                            title="View task"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEdit(task)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg transition-colors"
                            title="Edit task"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(task)}
                            className="p-1.5 text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                            title="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

TaskTable.displayName = 'TaskTable';
export default TaskTable;
