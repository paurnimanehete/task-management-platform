const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      minlength: [3, 'Task title must be at least 3 characters long'],
      maxlength: [100, 'Task title cannot exceed 100 characters'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a task description'],
      trim: true,
      maxlength: [2000, 'Task description cannot exceed 2000 characters'],
    },
    priority: {
      type: String,
      required: [true, 'Please select a priority level'],
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: '{VALUE} is not a valid priority level (Low, Medium, High)',
      },
      default: 'Medium',
      index: true,
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide a due date'],
      index: true,
    },
    status: {
      type: String,
      required: [true, 'Please select a task status'],
      enum: {
        values: ['Pending', 'In Progress', 'Completed'],
        message: '{VALUE} is not a valid status (Pending, In Progress, Completed)',
      },
      default: 'Pending',
      index: true,
    },
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please assign this task to a user'],
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task creator is required'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying user tasks sorted by dueDate / createdAt
taskSchema.index({ createdBy: 1, status: 1 });
taskSchema.index({ assignedUser: 1, status: 1 });
taskSchema.index({ title: 'text', description: 'text' });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
