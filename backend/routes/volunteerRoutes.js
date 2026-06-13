const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');
const { protect } = require('../middleware/authMiddleware');

// @desc    Register a new volunteer
// @route   POST /api/volunteers/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, skills, availability, password } = req.body;
    const volunteerExists = await Volunteer.findOne({ email });
    if (volunteerExists) {
      return res.status(400).json({ message: 'This email is already registered as a volunteer.' });
    }
    const newVolunteer = await Volunteer.create({ name, email, phone, skills, availability, password });
    res.status(201).json({ success: true, message: 'Volunteer registered successfully!', data: newVolunteer });
  } catch (error) {
    console.error(`Error saving volunteer: ${error.message}`);
    res.status(500).json({ message: 'Server Error. Please try again later.' });
  }
});

// @desc    Get logged in volunteer profile
// @route   GET /api/volunteers/profile
router.get('/profile', protect, async (req, res) => {
  try {
    if (!req.volunteer) {
      return res.status(404).json({ message: 'Volunteer profile not found' });
    }
    res.json(req.volunteer);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching profile.' });
  }
});

// @desc    Get all volunteers (Admin only)
// @route   GET /api/volunteers
router.get('/', protect, async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching records.' });
  }
});

// @desc    Update volunteer status (Admin only)
// @route   PUT /api/volunteers/:id
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status type' });
    }
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer profile not found' });
    }
    volunteer.status = status;
    await volunteer.save();
    res.json({ success: true, message: `Application status updated to ${status}`, data: volunteer });
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating application.' });
  }
});

// @desc    Delete volunteer (Admin only)
// @route   DELETE /api/volunteers/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer profile not found' });
    }
    await volunteer.deleteOne();
    res.json({ success: true, message: 'Volunteer record removed permanently' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error executing delete.' });
  }
});

module.exports = router;