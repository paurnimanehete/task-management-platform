const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get all tasks with search, filtering, sorting, and pagination
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const {
      search,
      status,
      priority,
      assignedUser,
      sortBy = 'dueDate',
      sortOrder = 'asc',
      page = 1,
      limit = 10,
      filterScope, // 'my_tasks', 'assigned_to_me', 'created_by_me', or 'all'
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = {};

    // Authorization & Scope filter
    // Use $and to safely combine scope $or with search $or without conflicts
    const andConditions = [];

    if (filterScope === 'assigned_to_me') {
      query.assignedUser = req.user._id;
    } else if (filterScope === 'created_by_me') {
      query.createdBy = req.user._id;
    } else if (filterScope === 'my_tasks') {
      andConditions.push({ $or: [{ createdBy: req.user._id }, { assignedUser: req.user._id }] });
    } else {
      // Team-wide: optionally filter by a specific assigned user
      if (assignedUser) {
        query.assignedUser = assignedUser;
      }
    }

    // Status filter
    if (status && status !== 'all' && ['Pending', 'In Progress', 'Completed'].includes(status)) {
      query.status = status;
    }

    // Priority filter
    if (priority && priority !== 'all' && ['Low', 'Medium', 'High'].includes(priority)) {
      query.priority = priority;
    }

    // Search filter — uses $or internally, safe via $and wrapper
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      andConditions.push({ $or: [{ title: searchRegex }, { description: searchRegex }] });
    }

    // Merge $and conditions if any exist
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    // Sorting
    const sort = {};
    const validSortFields = ['dueDate', 'createdAt', 'title', 'priority', 'status'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'dueDate';
    sort[sortField] = sortOrder === 'desc' ? -1 : 1;

    // Total count for pagination
    const totalTasks = await Task.countDocuments(query);

    // Fetch tasks
    const tasks = await Task.find(query)
      .populate('assignedUser', '_id name email avatar role')
      .populate('createdBy', '_id name email avatar role')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalTasks / limitNum) || 1;

    res.status(200).json({
      success: true,
      count: tasks.length,
      totalTasks,
      totalPages,
      currentPage: pageNum,
      limit: limitNum,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics and task statistics
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    // Aggregations from real database
    const [
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      highPriorityTasks,
      mediumPriorityTasks,
      lowPriorityTasks,
      overdueTasks,
      upcomingTasks,
      myAssignedTasks,
      recentTasks,
    ] = await Promise.all([
      Task.countDocuments({}),
      Task.countDocuments({ status: 'Pending' }),
      Task.countDocuments({ status: 'In Progress' }),
      Task.countDocuments({ status: 'Completed' }),
      Task.countDocuments({ priority: 'High' }),
      Task.countDocuments({ priority: 'Medium' }),
      Task.countDocuments({ priority: 'Low' }),
      Task.countDocuments({
        dueDate: { $lt: today },
        status: { $ne: 'Completed' },
      }),
      Task.countDocuments({
        dueDate: { $gte: today, $lte: nextWeek },
        status: { $ne: 'Completed' },
      }),
      Task.countDocuments({ assignedUser: req.user._id, status: { $ne: 'Completed' } }),
      Task.find({})
        .populate('assignedUser', '_id name email avatar')
        .populate('createdBy', '_id name email avatar')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        completionRate,
        overdueTasks,
        upcomingTasks,
        myAssignedTasks,
        priorityBreakdown: {
          high: highPriorityTasks,
          medium: mediumPriorityTasks,
          low: lowPriorityTasks,
        },
        statusBreakdown: {
          pending: pendingTasks,
          inProgress: inProgressTasks,
          completed: completedTasks,
        },
      },
      recentTasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedUser', '_id name email avatar role')
      .populate('createdBy', '_id name email avatar role');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, status, assignedUser } = req.body;

    // Validate assigned user exists
    const userExists = await User.findById(assignedUser);
    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: 'The assigned user does not exist in the database.',
      });
    }

    const newTask = await Task.create({
      title,
      description,
      priority: priority || 'Medium',
      dueDate,
      status: status || 'Pending',
      assignedUser,
      createdBy: req.user._id,
    });

    // Populate user references for response
    const populatedTask = await Task.findById(newTask._id)
      .populate('assignedUser', '_id name email avatar role')
      .populate('createdBy', '_id name email avatar role');

    res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      task: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details or status
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id of ${req.params.id}`,
      });
    }

    // Check authorization: creator, assignedUser, or admin
    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAssigned = task.assignedUser.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAssigned && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to modify this task.',
      });
    }

    // If changing assigned user, verify user exists
    if (req.body.assignedUser) {
      const userExists = await User.findById(req.body.assignedUser);
      if (!userExists) {
        return res.status(400).json({
          success: false,
          message: 'The new assigned user does not exist.',
        });
      }
    }

    // Update task
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('assignedUser', '_id name email avatar role')
      .populate('createdBy', '_id name email avatar role');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully!',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id of ${req.params.id}`,
      });
    }

    // Authorization check: Only creator or admin can delete task
    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this task. Only the creator or an admin can delete it.',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully!',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
