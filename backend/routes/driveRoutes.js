const express = require('express');
const router = express.Router();
const Drive = require('../models/Drive');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all campaign drives
// @route   GET /api/drives
router.get('/', async (req, res) => {
  try {
    const drives = await Drive.find().populate('volunteers', 'name email phone availability skills').sort({ createdAt: -1 });
    res.json(drives);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching drives.' });
  }
});

// @desc    Create a new campaign drive (Admin only)
// @route   POST /api/drives
router.post('/', protect, async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }

    const { title, description, skills, tag, icon, colorTheme } = req.body;
    if (!title || !description || !skills || !tag) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const drive = await Drive.create({ title, description, skills, tag, icon, colorTheme });
    res.status(201).json({ success: true, data: drive });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error creating drive.' });
  }
});

// @desc    Update a campaign drive (Admin only)
// @route   PUT /api/drives/:id
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }

    const { title, description, skills, tag, icon, colorTheme } = req.body;
    const drive = await Drive.findById(req.params.id);
    
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    if (title) drive.title = title;
    if (description) drive.description = description;
    if (skills) drive.skills = skills;
    if (tag) drive.tag = tag;
    if (icon) drive.icon = icon;
    if (colorTheme) drive.colorTheme = colorTheme;

    await drive.save();
    res.json({ success: true, data: drive });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error updating drive.' });
  }
});

// @desc    Delete a campaign drive (Admin only)
// @route   DELETE /api/drives/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }

    const drive = await Drive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    await drive.deleteOne();
    res.json({ success: true, message: 'Drive removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error deleting drive.' });
  }
});

// @desc    Join a campaign drive (Volunteer only)
// @route   POST /api/drives/:id/join
router.post('/:id/join', protect, async (req, res) => {
  try {
    if (req.role !== 'volunteer') {
      return res.status(403).json({ message: 'Forbidden. Only approved volunteers can participate in drives.' });
    }

    const drive = await Drive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ message: 'Campaign drive not found' });
    }

    // Check if volunteer has already joined
    if (drive.volunteers.includes(req.volunteer._id)) {
      return res.status(400).json({ message: 'You have already volunteered for this drive.' });
    }

    drive.volunteers.push(req.volunteer._id);
    await drive.save();

    // Populate volunteers to return updated list
    const updatedDrive = await Drive.findById(drive._id).populate('volunteers', 'name email phone availability skills');

    res.json({ success: true, message: 'Thank you for volunteering!', data: updatedDrive });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error joining drive.' });
  }
});

module.exports = router;
