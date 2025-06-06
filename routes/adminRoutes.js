// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

// Admin login is handled separately in authRoutes (not here).

// GET /api/admin/users
router.get('/users', adminAuth, adminController.getAllUsers);

// POST /api/admin/send-message
router.post('/send-message', adminAuth, adminController.sendMessageToUser);

// PUT /api/admin/wallet
router.put('/wallet', adminAuth, adminController.updateUserWallet);

// POST /api/admin/verify-withdrawal
router.post('/verify-withdrawal', adminAuth, adminController.setWithdrawalPin);

// POST /api/admin/tasks
router.post('/tasks', adminAuth, adminController.createTask);

// PUT /api/admin/tasks/:id
router.put('/tasks/:id', adminAuth, adminController.updateTask);

// DELETE /api/admin/tasks/:id
router.delete('/tasks/:id', adminAuth, adminController.deleteTask);

// POST /api/admin/approve-task
router.post('/approve-task', adminAuth, adminController.approveTask);

module.exports = router;
