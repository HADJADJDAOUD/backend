const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Import your user model

const router = express.Router();

// Sign-up route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

    // Send confirmation email
    const confirmationToken = jwt.sign({ email }, process.env.EMAIL_SECRET, { expiresIn: '1d' });
    const confirmationLink = `https://yourdomain.com/confirm/${confirmationToken}`; // Replace with your confirmation link
    const transporter = nodemailer.createTransport({
      // Configure nodemailer transport
    });
    await transporter.sendMail({
      to: email,
      subject: 'Confirm Your Registration',
      text: `Please click on the following link to confirm your registration: ${confirmationLink}`,
    });

    res.status(201).json({ message: 'User registered successfully. Please check your email for confirmation.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Confirm registration route
router.get('/confirm/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decodedToken = jwt.verify(token, process.env.EMAIL_SECRET);

    // Update user's confirmation status in the database
    await User.findOneAndUpdate({ email: decodedToken.email }, { confirmed: true });

    res.redirect('/login'); // Redirect to login page after confirmation
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;
