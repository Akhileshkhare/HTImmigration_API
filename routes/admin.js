const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  const { email, password, username } = req.body;
  const loginField = email ? { email } : username ? { email:username } : {};
  try {
    const user = await User.findOne({ where: { ...loginField, role: 'admin' } });
    console.log('Login attempt:', { email, username, role: 'admin' });
    console.log('Found user:', user ? user.toJSON() : 'No user found');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // If the password in DB is not hashed, compare directly
    let isMatch;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      // bcrypt hash
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // plain text fallback
      isMatch = password === user.password;
    }
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, first_name: user.first_name, last_name: user.last_name, username: user.username } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Logout (client should just delete token, but endpoint for completeness)
router.post('/logout', (req, res) => {
  // For JWT, logout is handled client-side by deleting the token
  res.json({ message: 'Logged out' });
});

module.exports = router;
