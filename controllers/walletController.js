// controllers/walletController.js

const User = require('../models/User');
const nodemailer = require('nodemailer');

/**
 * GET /api/wallet
 * Returns the current authenticated user’s wallet balance.
 */
exports.getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('walletBalance');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ balance: user.walletBalance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/wallet/withdraw
 * Body: { amount, crypto, address, pin }
 * Verifies PIN, checks funds, deducts balance, records message, emails admin.
 */
exports.requestWithdraw = async (req, res) => {
  const { amount, crypto, address, pin } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 1) Verify PIN
    if (!user.withdrawalPin || user.withdrawalPin !== pin) {
      return res.status(400).json({ message: 'Invalid PIN' });
    }

    // 2) Check funds
    if (user.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // 3) Deduct
    user.walletBalance -= amount;

    // 4) Record a message in user’s inbox
    user.messages.push({
      from: 'System',
      content: `Your withdrawal of $${amount.toFixed(2)} in ${crypto} to ${address} has been processed.`,
      date: new Date()
    });
    await user.save();

    // 5) Notify admin via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: `"JobRemote Platform" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Withdrawal Confirmed',
      html: `<p>User ${user.email} confirmed withdrawal of $${amount.toFixed(2)} in ${crypto} to address ${address}.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending withdrawal email:', error);
      }
    });

    res.json({ message: 'Withdrawal processed', walletBalance: user.walletBalance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
