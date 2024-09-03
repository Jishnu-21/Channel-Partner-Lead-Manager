const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ChannelPartner = require('../models/ChannelPartner');
const InternalUser = require('../models/InternalUser');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// @desc    Login user
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
    const token = jwt.sign({ id: user._id, userType }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error.message); // Log the specific error message
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Route to get channel partner code based on user
const channelPartnerCode = async (req, res) => {
  try {
    // Fetch the user by their ID from the database
    const user = await ChannelPartner.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the channelPartnerCode from the user object
    res.json({ channelPartnerCode: user.channelPartnerCode });
  } catch (error) {
    console.error('Error fetching channel partner code:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to get all channel partners
const getChannelPartners = async (req, res) => {
  try {
    const channelPartners = await ChannelPartner.find(); // Fetch all channel partners
    res.json(channelPartners); // Return the data as JSON
  } catch (error) {
    console.error('Error fetching channel partners:', error); // Log error details
    res.status(500).json({ message: 'Internal Server Error', error: error.message }); // Handle errors
  }
};

// Export the router
module.exports = {
  login,
  getChannelPartners,
  channelPartnerCode, // Ensure you export the router
};
