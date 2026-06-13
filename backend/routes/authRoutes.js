const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Volunteer = require('../models/Volunteer');

// Helper function to instantly generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new Admin (Keep this hidden or use once to set up your account)
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = await Admin.create({ name, email, password });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: 'admin',
      token: generateToken(admin._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Auth user (admin or volunteer) & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Try to find admin
    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
      return res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
        token: generateToken(admin._id)
      });
    }

    // 2. Try to find volunteer
    const volunteer = await Volunteer.findOne({ email });
    if (volunteer && (await volunteer.matchPassword(password))) {
      return res.json({
        _id: volunteer._id,
        name: volunteer.name,
        email: volunteer.email,
        role: 'volunteer',
        token: generateToken(volunteer._id)
      });
    }

    // 3. Fallback: Invalid credentials
    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;