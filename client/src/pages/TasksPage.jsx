import React, { useEffect, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PlusCircle, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useTasks } from '../hooks/useTasks';
import { useDebounce } from '../hooks/useDebounce';
import { fetchUsers } from '../features/users/userSlice';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskTable } from '../components/tasks/TaskTable';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskDetailView } from '../components/tasks/TaskDetailView';
import { Modal, ConfirmModal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { Pagination } from '../components/common/Pagination';
import { TaskCardSkeleton } from '../components/common/LoadingSpinner';

export const TasksPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.users);
  const [searchParams] = useSearchParams();

  const {
    tasks,
    pagination,
    filters,
    viewMode,
    loading,
    actionLoading,
    getTasks,
    addTask,
    editTask,
    removeTask,
    updateFilters,
    clearAllFilters,
    changePage,
    changeLimit,
    changeViewMode,
  } = useTasks();

  // Apply URL filterScope param on mount
  useEffect(() => {
    const scopeParam = searchParams.get('filterScope');
    if (scopeParam) {
      updateFilters({ filterScope: scopeParam });
    }
  }, []);

  // Debounce search input
  const debouncedSearch = useDebounce(filters.search, 400);

  // Fetch tasks when filters/pagination change (using debounced search)
  useEffect(() => {
    getTasks();
  }, [
    debouncedSearch,
    filters.status,
    filters.priority,
    filters.filterScope,
    filters.sortBy,
    filters.sortOrder,
    pagination.currentPage,
    pagination.limit,
  ]);

  // Load team users on mount
  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, []);

  // Modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [editTask_, setEditTask] = useState(null);
  const [viewTask_, setViewTask] = useState(null);
  const [deleteTask_, setDeleteTask] = useState(null);

  const handleOpenCreate = useCallback(() => {
    setCreateOpen(true);
  }, []);

  const handleView = useCallback((task) => setViewTask(task), []);
  const handleEdit = useCallback((task) => {
    setViewTask(null);
    setEditTask(task);
  }, []);
  const handleDelete = useCallback((task) => {
    setViewTask(null);
    setDeleteTask(task);
  }, []);

  const handleCreateSubmit = async (formData) => {
    const result = await addTask(formData);
    if (!result.error) {
      toast.success('Task created successfully!');
      setCreateOpen(false);
      getTasks();
    } else {
      toast.error(result.payload || 'Failed to create task.');
    }
  };

  const handleEditSubmit = async (formData) => {
    const result = await editTask(editTask_._id, formData);
    if (!result.error) {
      toast.success('Task updated successfully!');
      setEditTask(null);
      getTasks();
    } else {
      toast.error(result.payload || 'Failed to update task.');
    }
  };

  const handleConfirmDelete = async () => {
    const result = await removeTask(deleteTask_._id);
    if (!result.error) {
      toast.success('Task deleted successfully.');
      setDeleteTask(null);
      getTasks();
    } else {
      toast.error(result.payload || 'Failed to delete task.');
    }
  };

  const handleStatusChange = useCallback(
    async (taskId, newStatus) => {
      const result = await editTask(taskId, { status: newStatus });
      if (!result.error) {
        toast.success(`Status updated to "${newStatus}"`);
        getTasks();
      } else {
        toast.error(result.payload || 'Failed to update status.');
      }
    },
    [editTask, getTasks]
  );

  const handleSort = useCallback(
    (field) => {
      if (filters.sortBy === field) {
        updateFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
      } else {
        updateFilters({ sortBy: field, sortOrder: 'asc' });
      }
    },
    [filters.sortBy, filters.sortOrder, updateFilters]
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All Tasks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {pagination.totalTasks} task{pagination.totalTasks !== 1 ? 's' : ''} found
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/25 active:scale-[0.98] transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">New Task</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-5 shadow-sm">
        <TaskFilters
          filters={filters}
          viewMode={viewMode}
          onFiltersChange={updateFilters}
          onViewModeChange={changeViewMode}
          onReset={clearAllFilters}
        />
      </div>

      {/* Task Grid or Table */}
      {loading && viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: pagination.limit }).map((_, i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      ) : tasks.length === 0 && !loading ? (
        <EmptyState
          icon={ClipboardList}
          title="No tasks found"
          description={
            filters.search || filters.status !== 'all' || filters.priority !== 'all'
              ? 'No tasks match your search or filters. Try clearing them.'
              : 'You have no tasks yet. Create your first task to get started!'
          }
          actionText="Create First Task"
          onAction={handleOpenCreate}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              currentUserId={user?._id}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <TaskTable
          tasks={tasks}
          loading={loading}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSort={handleSort}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentUserId={user?._id}
        />
      )}

      {/* Pagination */}
      {!loading && tasks.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalTasks}
          itemsPerPage={pagination.limit}
          onPageChange={changePage}
          onLimitChange={changeLimit}
        />
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create New Task"
        subtitle="Fill in the details below to create a new task."
        maxWidth="max-w-2xl"
      >
        <TaskForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setCreateOpen(false)}
          loading={actionLoading}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={!!editTask_}
        onClose={() => setEditTask(null)}
        title="Edit Task"
        subtitle={`Editing: ${editTask_?.title || ''}`}
        maxWidth="max-w-2xl"
      >
        <TaskForm
          initialData={editTask_}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditTask(null)}
          loading={actionLoading}
        />
      </Modal>

      {/* View Task Detail Modal */}
      <Modal
        isOpen={!!viewTask_}
        onClose={() => setViewTask(null)}
        title="Task Details"
        maxWidth="max-w-xl"
      >
        <TaskDetailView
          task={viewTask_}
          currentUserId={user?._id}
          onClose={() => setViewTask(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteTask_}
        onClose={() => setDeleteTask(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTask_?.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        loading={actionLoading}
      />
    </div>
  );
};

export default TasksPage;
