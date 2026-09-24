const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllUsers);

module.exports = router;
