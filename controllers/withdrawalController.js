const User = require('../models/User');
const nodemailer = require('nodemailer');

exports.initiateWithdrawal = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate tax (10% of balance)
    const taxAmount = user.walletBalance * 0.1;

    // Generate and save 5‐digit PIN
    const pin = Math.floor(10000 + Math.random() * 90000).toString();
    user.withdrawalPin = pin;
    await user.save();

    // Send email with PIN
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      to: user.email,
      subject: 'Withdrawal Verification PIN',
      text: `Your verification PIN is: ${pin}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending PIN email:', err);
      }
    });

    res.json({
      taxAmount,
      cryptoDetails: {
        Bitcoin: '535afgvshadsb534sfb',
        Ethereum: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
        // Add additional crypto addresses here if needed
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
