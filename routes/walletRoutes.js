// routes/walletRoutes.js

const express = require('express');
const router = express.Router();
const { getWallet, requestWithdraw } = require('../controllers/walletController');
const { auth } = require('../middleware/auth');

// GET /api/wallet
router.get('/', auth, getWallet);

// POST /api/wallet/withdraw
router.post('/withdraw', auth, requestWithdraw);

module.exports = router;
