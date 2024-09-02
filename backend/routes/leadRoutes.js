const express = require('express');
const { createLead, getLeads } = require('../controllers/leadController');

const router = express.Router();

// Route to create a new lead
router.post('/', createLead);

// Route to get all leads
router.get('/', getLeads);

// Add more routes for filtering, updating, and deleting leads as needed

module.exports = router;
