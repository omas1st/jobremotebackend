// controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Configure Nodemailer transporter using admin credentials from .env
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD
  }
});

// Helper: send a notification email to the admin
const notifyAdmin = async (subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject,
      text
    });
  } catch (err) {
    console.error('Error sending admin notification:', err);
  }
};

exports.register = async (req, res) => {
  try {
    const { profileType, firstName, lastName, email, phone, gender, country, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      profileType,
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      gender,
      country,
      password: hashedPassword
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    // Notify admin via email
    const subject = 'New User Registered';
    const text = `
A new user has just registered:

Name: ${firstName} ${lastName}
Email: ${email.toLowerCase()}
Profile Type: ${profileType}
Country: ${country}

Timestamp: ${new Date().toISOString()}
    `.trim();
    notifyAdmin(subject, text);

    // Send response back to frontend
    res.status(201).json({ token, profileType });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    // Notify admin via email
    const subject = 'User Logged In';
    const text = `
A user has just logged in:

Name: ${user.firstName} ${user.lastName}
Email: ${user.email}
Profile Type: ${user.profileType}

Timestamp: ${new Date().toISOString()}
    `.trim();
    notifyAdmin(subject, text);

    // Send response back to frontend
    res.json({ token, profileType: user.profileType });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
      phone
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // In a real app, you would send an email with reset instructions
    res.json({ message: 'Reset instructions sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: error.message });
  }
};
