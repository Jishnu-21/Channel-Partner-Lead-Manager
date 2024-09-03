const express = require('express');
const { login, getChannelPartners, channelPartnerCode } = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Route to authenticate user
router.post('/login',login );
router.get('/channel-partners',getChannelPartners );
router.get('/cp',authenticate,channelPartnerCode );


// Add more routes for filtering, updating, and deleting leads as needed

module.exports = router;
