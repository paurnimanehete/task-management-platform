import React, { useCallback } from 'react';
import { Search, Filter, RotateCcw, LayoutGrid, List } from 'lucide-react';

const selectCls =
  'text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors cursor-pointer';

export const TaskFilters = React.memo(({
  filters,
  viewMode,
  onFiltersChange,
  onViewModeChange,
  onReset,
}) => {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.filterScope !== 'all' ||
    filters.sortBy !== 'dueDate' ||
    filters.sortOrder !== 'asc';

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      onFiltersChange({ [name]: value });
    },
    [onFiltersChange]
  );

  return (
    <div className="space-y-3">
      {/* Top row: Search + View Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            id="task-search"
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search tasks by title or description…"
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
            title="Grid view"
            aria-label="Switch to grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-2 transition-colors ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
            title="Table view"
            aria-label="Switch to table view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />

        <select name="status" value={filters.status} onChange={handleChange} className={selectCls} aria-label="Filter by status">
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select name="priority" value={filters.priority} onChange={handleChange} className={selectCls} aria-label="Filter by priority">
          <option value="all">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select name="filterScope" value={filters.filterScope} onChange={handleChange} className={selectCls} aria-label="Filter by scope">
          <option value="all">All Tasks</option>
          <option value="assigned_to_me">Assigned to Me</option>
          <option value="created_by_me">Created by Me</option>
          <option value="my_tasks">My Tasks</option>
        </select>

        <select name="sortBy" value={filters.sortBy} onChange={handleChange} className={selectCls} aria-label="Sort by field">
          <option value="dueDate">Sort by Due Date</option>
          <option value="createdAt">Sort by Created</option>
          <option value="title">Sort by Title</option>
          <option value="priority">Sort by Priority</option>
          <option value="status">Sort by Status</option>
        </select>

        <select name="sortOrder" value={filters.sortOrder} onChange={handleChange} className={selectCls} aria-label="Sort order">
          <option value="asc">Ascending ↑</option>
          <option value="desc">Descending ↓</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/60 border border-red-200 dark:border-red-800/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
});

TaskFilters.displayName = 'TaskFilters';
export default TaskFilters;
