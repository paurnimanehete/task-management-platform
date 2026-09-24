import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchTasks,
  fetchTaskStats,
  fetchTaskById,
  createTask,
  updateTask,
  deleteTask,
  setFilter,
  resetFilters,
  setPage,
  setLimit,
  setViewMode,
  clearCurrentTask,
  clearTaskError,
} from '../features/tasks/taskSlice';

export const useTasks = () => {
  const dispatch = useDispatch();
  const {
    tasks,
    currentTask,
    stats,
    recentTasks,
    pagination,
    filters,
    viewMode,
    loading,
    statsLoading,
    actionLoading,
    error,
  } = useSelector((state) => state.tasks);

  const getTasks = useCallback(() => dispatch(fetchTasks()), [dispatch]);
  const getStats = useCallback(() => dispatch(fetchTaskStats()), [dispatch]);
  const getTask = useCallback((id) => dispatch(fetchTaskById(id)), [dispatch]);

  const addTask = useCallback(
    (taskData) => dispatch(createTask(taskData)),
    [dispatch]
  );

  const editTask = useCallback(
    (id, taskData) => dispatch(updateTask({ id, taskData })),
    [dispatch]
  );

  const removeTask = useCallback(
    (id) => dispatch(deleteTask(id)),
    [dispatch]
  );

  const updateFilters = useCallback(
    (newFilters) => dispatch(setFilter(newFilters)),
    [dispatch]
  );

  const clearAllFilters = useCallback(
    () => dispatch(resetFilters()),
    [dispatch]
  );

  const changePage = useCallback(
    (page) => dispatch(setPage(page)),
    [dispatch]
  );

  const changeLimit = useCallback(
    (limit) => dispatch(setLimit(limit)),
    [dispatch]
  );

  const changeViewMode = useCallback(
    (mode) => dispatch(setViewMode(mode)),
    [dispatch]
  );

  const resetCurrent = useCallback(
    () => dispatch(clearCurrentTask()),
    [dispatch]
  );

  const clearError = useCallback(
    () => dispatch(clearTaskError()),
    [dispatch]
  );

  return {
    tasks,
    currentTask,
    stats,
    recentTasks,
    pagination,
    filters,
    viewMode,
    loading,
    statsLoading,
    actionLoading,
    error,
    getTasks,
    getStats,
    getTask,
    addTask,
    editTask,
    removeTask,
    updateFilters,
    clearAllFilters,
    changePage,
    changeLimit,
    changeViewMode,
    resetCurrent,
    clearError,
  };
};

export default useTasks;
