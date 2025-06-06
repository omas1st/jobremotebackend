const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// Unprotected (authentication) routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected (“/api/user/…”) routes
router.get('/profile', auth, userController.getUserProfile);
router.post('/contact-admin', auth, userController.contactAdmin);
router.post('/attempt-task', auth, userController.attemptTask);
router.get('/initiate-withdrawal', auth, userController.initiateWithdrawal);
router.post('/verify-withdrawal', auth, userController.verifyWithdrawal);

module.exports = router;
