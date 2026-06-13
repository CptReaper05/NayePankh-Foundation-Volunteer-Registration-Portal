const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Volunteer = require('../models/Volunteer');

const protect = async (req, res, next) => {
  let token;

  // Check if the request contains a Bearer token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from string ("Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token authenticity using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 1. Check if the token belongs to an Admin
      const admin = await Admin.findById(decoded.id).select('-password');
      if (admin) {
        req.admin = admin;
        req.user = admin;
        req.role = 'admin';
        return next();
      }

      // 2. Check if the token belongs to a Volunteer
      const volunteer = await Volunteer.findById(decoded.id).select('-password');
      if (volunteer) {
        req.volunteer = volunteer;
        req.user = volunteer;
        req.role = 'volunteer';
        return next();
      }

      return res.status(401).json({ message: 'Not authorized, token validation failed' });
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token validation failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token found' });
  }
};

module.exports = { protect };