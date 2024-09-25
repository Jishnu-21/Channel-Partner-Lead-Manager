const Lead = require('../models/Lead');
const ChannelPartner = require('../models/ChannelPartner'); 

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res) => {
    try {
        const { channelPartnerCode, leadName, contactNumber, email, leadSource, leadInterest, additionalNotes } = req.body;

        // Check if the contact number is 10 digits
        const isValidPhoneNumber = /^\d{10}$/.test(contactNumber);
        if (!isValidPhoneNumber) {
        return res.status(400).json({ message: 'Contact number must be exactly 10 digits.' });
          }

        const channelPartner = await ChannelPartner.findOne({ code: channelPartnerCode });
        
        if (!channelPartner) {
            return res.status(404).json({ message: 'Channel Partner Code not found.' });
        }

        // Check for an existing lead with the same details
        const existingLead = await Lead.findOne({
            channelPartnerCode,
            leadName,
            contactNumber,
            email,
            leadSource,
            leadInterest,
            additionalNotes
        });

        // If a lead with the same details exists, return a conflict status
        if (existingLead) {
            return res.status(409).json({ message: 'Lead already exists with the same details.' });
        }
        const newLead = new Lead(req.body);
        const savedLead = await newLead.save();

        // Respond with the created lead
        res.status(201).json(savedLead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// @desc    Get all leads
// @route   GET /api/leads
// @access  Public

const getLeads = async (req, res) => {
    try {
        const leads = await Lead.find();
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    createLead,
    getLeads,
};
