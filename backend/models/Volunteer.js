const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const VolunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true, 
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  skills: {
    type: [String], 
    required: true
  },
  availability: {
    type: String,
    enum: ['Weekdays', 'Weekends', 'Both'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending' 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Automatically hash the password before saving it to the database
VolunteerSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with the hashed password in the database
VolunteerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Volunteer', VolunteerSchema);