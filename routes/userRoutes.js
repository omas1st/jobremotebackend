// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// GET /api/user/profile
router.get('/profile', auth, userController.getUserProfile);

// POST /api/user/contact-admin
router.post('/contact-admin', auth, userController.contactAdmin);

// POST /api/user/attempt-task
router.post('/attempt-task', auth, userController.attemptTask);

// GET /api/user/initiate-withdrawal
router.get('/initiate-withdrawal', auth, userController.initiateWithdrawal);

// POST /api/user/verify-withdrawal
router.post('/verify-withdrawal', auth, userController.verifyWithdrawal);

module.exports = router;
