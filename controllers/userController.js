// controllers/userController.js

const User = require('../models/User');
const Task = require('../models/Task');

/**
 * Get current user’s profile
 */
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Contact Admin (send a message to admin)
 */
exports.contactAdmin = async (req, res) => {
  try {
    const { message } = req.body;
    // In a real app, you might email the admin; here we just acknowledge
    res.json({ message: 'Message sent to admin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Attempt a task (mark task as attempted for this user)
 */
exports.attemptTask = async (req, res) => {
  try {
    const { taskId } = req.body;
    const user = await User.findById(req.userId);

    if (!user.attemptedTasks.includes(taskId)) {
      user.attemptedTasks.push(taskId);
      await user.save();
    }

    res.json({ message: 'Task attempted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Initiate withdrawal: check 15-day rule and minimum balance, return tax and crypto details
 */
exports.initiateWithdrawal = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    // Check if 15 days have passed since registration
    const registrationDate = new Date(user.createdAt);
    const today = new Date();
    const diffDays = Math.floor(
      (today - registrationDate) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 15) {
      return res.status(400).json({ message: 'Withdrawal allowed only after 15 days of registration' });
    }

    if (user.walletBalance < 200) {
      return res.status(400).json({ message: 'Minimum withdrawal amount is $200' });
    }

    // Calculate tax (10%)
    const taxAmount = user.walletBalance * 0.1;

    res.json({
      taxAmount,
      cryptoDetails: {
        Bitcoin: '535afgvshadsb534sfb'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Verify withdrawal PIN
 */
exports.verifyWithdrawal = async (req, res) => {
  try {
    const { pin } = req.body;
    const user = await User.findById(req.userId);

    if (user.withdrawalPin !== pin) {
      return res.status(400).json({ message: 'Invalid PIN' });
    }

    res.json({ message: 'Withdrawal verified' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
