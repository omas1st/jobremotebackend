// controllers/adminController.js

const User = require('../models/User');
const Task = require('../models/Task');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Issue a JWT that the admin frontend will store
  const token = jwt.sign(
    { role: 'admin', user: username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  res.status(200).json({ token });
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessageToUser = async (req, res) => {
  try {
    const { email, message } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // In a real app you'd persist this message or email it.
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveTask = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.walletBalance += amount;
    await user.save();

    res.json({ message: 'Task approved', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
