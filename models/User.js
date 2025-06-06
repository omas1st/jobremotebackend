// models/User.js

const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  from: String,
  content: String,
  date: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  profileType: {
    type: String,
    enum: ['remote worker', 'customer'],
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  country: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  walletBalance: {
    type: Number,
    default: 0
  },
  attemptedTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  withdrawalPin: {
    type: String
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
