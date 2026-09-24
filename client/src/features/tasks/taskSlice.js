import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  tasks: [],
  currentTask: null,
  stats: {
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    overdueTasks: 0,
    upcomingTasks: 0,
    myAssignedTasks: 0,
    priorityBreakdown: { high: 0, medium: 0, low: 0 },
    statusBreakdown: { pending: 0, inProgress: 0, completed: 0 },
  },
  recentTasks: [],
  pagination: {
    totalTasks: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 9,
  },
  filters: {
    search: '',
    status: 'all',
    priority: 'all',
    filterScope: 'all',
    sortBy: 'dueDate',
    sortOrder: 'asc',
  },
  viewMode: 'grid', // 'grid' or 'table'
  loading: false,
  statsLoading: false,
  actionLoading: false,
  error: null,
};

// Async Thunk: Fetch Tasks with Filters & Pagination
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { filters, pagination } = getState().tasks;
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      if (filters.search) params.search = filters.search;
      if (filters.status && filters.status !== 'all') params.status = filters.status;
      if (filters.priority && filters.priority !== 'all') params.priority = filters.priority;
      if (filters.filterScope && filters.filterScope !== 'all') params.filterScope = filters.filterScope;

      const response = await api.get('/tasks', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk: Fetch Dashboard Statistics & Recent Tasks
export const fetchTaskStats = createAsyncThunk(
  'tasks/fetchTaskStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/tasks/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk: Fetch Single Task by ID
export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data.task;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk: Create New Task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/tasks', taskData);
      // Refresh stats in the background
      dispatch(fetchTaskStats());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk: Update Task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      // Refresh stats in the background
      dispatch(fetchTaskStats());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk: Delete Task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      // Refresh stats in the background
      dispatch(fetchTaskStats());
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to page 1 on filter change
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        status: 'all',
        priority: 'all',
        filterScope: 'all',
        sortBy: 'dueDate',
        sortOrder: 'asc',
      };
      state.pagination.currentPage = 1;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.currentPage = 1;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.pagination.totalTasks = action.payload.totalTasks;
        state.pagination.totalPages = action.payload.totalPages;
        state.pagination.currentPage = action.payload.currentPage;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch tasks';
      });

    // Fetch Stats
    builder
      .addCase(fetchTaskStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchTaskStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload.stats;
        state.recentTasks = action.payload.recentTasks;
      })
      .addCase(fetchTaskStats.rejected, (state) => {
        state.statsLoading = false;
      });

    // Fetch Task By ID
    builder
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Task
    builder
      .addCase(createTask.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.tasks.unshift(action.payload.task);
        state.pagination.totalTasks += 1;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // Update Task
    builder
      .addCase(updateTask.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updatedTask = action.payload.task;
        state.tasks = state.tasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        );
        if (state.currentTask && state.currentTask._id === updatedTask._id) {
          state.currentTask = updatedTask;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // Delete Task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.tasks = state.tasks.filter((task) => task._id !== action.payload.id);
        state.pagination.totalTasks = Math.max(0, state.pagination.totalTasks - 1);
        if (state.currentTask && state.currentTask._id === action.payload.id) {
          state.currentTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilter,
  resetFilters,
  setPage,
  setLimit,
  setViewMode,
  clearCurrentTask,
  clearTaskError,
} = taskSlice.actions;

export default taskSlice.reducer;
