// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

router.post('/login', adminController.adminLogin);
router.get('/users', adminAuth, adminController.getAllUsers);
router.post('/send-message', adminAuth, adminController.sendMessageToUser);
router.put('/wallet', adminAuth, adminController.updateUserWallet);
router.post('/verify-withdrawal', adminAuth, adminController.setWithdrawalPin);
router.post('/tasks', adminAuth, adminController.createTask);
router.put('/tasks/:id', adminAuth, adminController.updateTask);
router.delete('/tasks/:id', adminAuth, adminController.deleteTask);
router.post('/approve-task', adminAuth, adminController.approveTask);

module.exports = router;
