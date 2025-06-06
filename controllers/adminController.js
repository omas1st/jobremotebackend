// controllers/adminController.js

const User = require('../models/User');
const Task = require('../models/Task');

/**
 * Admin Login (already implemented in authController/adminAuthRoutes)
 * But if needed here, it was handled via env credentials directly in auth routes.
 */

/**
 * Get all users (sorted by creation date descending)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Send a message to a specific user
 */
exports.sendMessageToUser = async (req, res) => {
  try {
    const { email, message } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Save message into user's inbox (old backend used messages array on User schema)
    user.messages.push({
      from: 'Admin',
      content: message,
      date: new Date()
    });
    await user.save();

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update a user’s wallet balance
 */
exports.updateUserWallet = async (req, res) => {
  try {
    const { email, balance } = req.body;
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { walletBalance: balance },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Wallet updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Set or update a user's withdrawal PIN
 */
exports.setWithdrawalPin = async (req, res) => {
  try {
    const { email, pin } = req.body;
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { withdrawalPin: pin },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Withdrawal PIN set', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new task
 */
exports.createTask = async (req, res) => {
  try {
    const { title, description, payment, externalLink } = req.body;
    const newTask = new Task({ title, description, payment, externalLink });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update a task by its ID
 */
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a task by its ID
 */
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Approve a user's task submission and credit their wallet
 * Expects { userId, amount } in request body
 */
exports.approveTask = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.walletBalance += amount;
    // Optionally notify user via message array:
    user.messages.push({
      from: 'System',
      content: `Your task payment of $${amount.toFixed(2)} has been approved and credited to your wallet.`,
      date: new Date()
    });
    await user.save();

    res.json({ message: 'Task approved', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
