const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { taskValidation, taskUpdateValidation } = require('../middleware/validator');

// All task routes are protected
router.use(protect);

router.get('/stats', getTaskStats);
router.route('/')
  .get(getTasks)
  .post(taskValidation, createTask);

router.route('/:id')
  .get(getTaskById)
  .put(taskUpdateValidation, updateTask)
  .delete(deleteTask);

module.exports = router;
