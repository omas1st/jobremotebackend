// routes/withdrawalRoutes.js

const express = require('express');
const router = express.Router();
const withdrawalController = require('../controllers/withdrawalController');
const { auth } = require('../middleware/auth');

// GET /api/withdrawal/initiate
router.get('/initiate', auth, withdrawalController.initiateWithdrawal);

// (Verification of PIN is handled in userRoutes -> verify-withdrawal)

module.exports = router;
