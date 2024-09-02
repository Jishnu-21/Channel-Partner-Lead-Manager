// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ChannelPartner = require('../models/ChannelPartner');
const InternalUser = require('../models/InternalUser');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// @desc    login user
// @route   POST /api/user/login
// @access  Public

const login = async (req, res) => {
    const { email, password, userType } = req.body;
  
    try {
      let user;
  
      // Check user type and find the user in the database
      if (userType === 'channelPartner') {
        user = await ChannelPartner.findOne({ email });
      } else if (userType === 'internalUser') {
        user = await InternalUser.findOne({ email });
      } else {
        return res.status(400).json({ message: 'Invalid user type' });
      }
  
      // Check if the user exists
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Compare the password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ id: user._id, userType }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      console.error('Login error:', error.message); // Log the specific error message
      // You can also log the full error object for more detail
      console.error(error); // Log the entire error object for debugging purposes
      res.status(500).json({ message: 'Server error', error: error.message }); // Send back a more informative error response
    }
  };
  
// Function to get all channel partners
const getChannelPartners = async (req, res) => {
    try {
        const channelPartners = await ChannelPartner.find(); // Fetch all channel partners
        res.json(channelPartners); // Return the data as JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors
    }
};

  module.exports = {
    login,
    getChannelPartners,
  };
  
