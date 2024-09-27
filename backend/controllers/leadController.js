const Lead = require('../models/Lead');
const ChannelPartner = require('../models/ChannelPartner'); 

const createLead = async (req, res) => {
    try {
        const leadData = req.body;
        console.log('Received lead data:', leadData);

        // Validate required fields
        const requiredFields = [
            'contactNumber', 'email', 'bdaName', 'companyName', 'clientName',
            'clientEmail', 'clientDesignation', 'companyOffering',
            'servicesRequested', 'totalServiceFeesCharged', 'gstBill','paymentDone', 
            'servicePromisedByBDA'
        ];

        for (const field of requiredFields) {
            if (!leadData[field]) {
                return res.status(400).json({ message: `${field} is required.` });
            }
        }

        // Check if the contact number is valid
        const isValidPhoneNumber = /^\d{10}$/.test(leadData.contactNumber);
        if (!isValidPhoneNumber) {
            return res.status(400).json({ message: 'Contact number must be exactly 10 digits.' });
        }

        // Handle file uploads
        if (req.files) {
            if (req.files.quotationFile) {
                leadData.quotationFile = req.files.quotationFile[0].path;
            }
            if (req.files.paymentProof) {
                leadData.paymentProof = req.files.paymentProof[0].path;
            }
        }

        // Handle package details
        if (leadData.packages) {
            if (!leadData.packageType) {
                return res.status(400).json({ message: 'Package type is required when a package is selected.' });
            }
        } else {
            if (leadData.servicesRequested.includes('Website Development') && !leadData.websiteDevelopmentTime) {
                return res.status(400).json({ message: 'Website Development Time Period is required.' });
            }
            if (leadData.servicesRequested.includes('Branding') && !leadData.brandingTime) {
                return res.status(400).json({ message: 'Branding Time Period is required.' });
            }
            if (leadData.servicesRequested.includes('Social Media Management') && !leadData.socialMediaTime) {
                return res.status(400).json({ message: 'Social Media Marketing Time Period is required.' });
            }
        }

        // Convert string arrays to actual arrays if necessary
        ['servicesRequested', 'socialMediaManagementRequirement', 'brandingRequirement'].forEach(field => {
            if (typeof leadData[field] === 'string') {
                try {
                    leadData[field] = JSON.parse(leadData[field]);
                } catch (error) {
                    return res.status(400).json({ message: `Invalid format for ${field}. Expected JSON array.` });
                }
            }
        });

        // Create new lead
        const newLead = new Lead(leadData);
        const savedLead = await newLead.save();

        // Respond with the created lead
        res.status(201).json(savedLead);
    } catch (error) {
        console.error('Error in createLead:', error);
        res.status(400).json({ message: error.message, stack: error.stack });
    }
};

const getLeads = async (req, res) => {
    try {
        const leads = await Lead.find();
        console.log('Fetched leads:', leads);
        if (!leads || leads.length === 0) {
            return res.status(404).json({ message: 'No leads found' });
        }
        res.json(leads);
    } catch (error) {
        console.error('Error in getLeads:', error);
        res.status(500).json({ message: error.message });
    }
};

const getLeadsByBDA = async (req, res) => {
    try {
        const { bdaName } = req.query;
        const leads = await Lead.find({ bdaName });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leads', error: error.message });
    }
};

const updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedLead = await Lead.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedLead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.json(updatedLead);
    } catch (error) {
        res.status(500).json({ message: 'Error updating lead', error: error.message });
    }
};

module.exports = {
    createLead,
    getLeads,
    getLeadsByBDA,
    updateLead
};