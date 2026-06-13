const mongoose = require('mongoose');

const DriveSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a campaign title']
  },
  description: {
    type: String,
    required: [true, 'Please add a campaign description']
  },
  skills: {
    type: [String],
    required: [true, 'Please add required skills']
  },
  tag: {
    type: String,
    required: [true, 'Please add a category tag']
  },
  icon: {
    type: String,
    default: '🍲'
  },
  colorTheme: {
    type: String,
    enum: ['amber', 'rose', 'emerald', 'sky'],
    default: 'emerald'
  },
  volunteers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Volunteer'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Drive', DriveSchema);
