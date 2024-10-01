const Lead = require('../models/Lead');
const ChannelPartner = require('../models/ChannelPartner');
const Notification = require('../models/Notification');
const { pusher } = require('../server'); // Import the Pusher instance
const path = require('path');
const fs = require('fs');
// Helper function to check if a payment is due soon
const checkPaymentDueSoon = async (lead) => {
    if (lead.paymentDueDate) {
        const dueDate = new Date(lead.paymentDueDate);
        const now = new Date();
        const differenceInDays = (dueDate - now) / (1000 * 3600 * 24);
        
        // If payment is due within 3 days
        if (differenceInDays <= 3 && differenceInDays > 0) {
            const message = `Payment for ${lead.companyName} is due in ${Math.ceil(differenceInDays)} days`;
            
            // Create a new notification
            const newNotification = new Notification({
                message,
                type: 'payment_due',
                relatedId: lead._id,
                dueDate: lead.paymentDueDate,
                read: false
            });

            await newNotification.save();

            // Trigger Pusher event
            pusher.trigger('payment-alerts', 'payment-due-soon', {
                message,
                leadId: lead._id,
                dueDate: lead.paymentDueDate,
                notificationId: newNotification._id
            });
        }
    }
};

const createLead = async (req, res) => {
    try {
        const leadData = req.body;
        
        // Debugging: Log the received data
        console.log('Received lead data:', JSON.stringify(leadData, null, 2));

        // Sanitize the platform data
        const sanitizePlatforms = (platforms) => {
            if (!platforms) return undefined;
            if (typeof platforms === 'string') {
                // If it's a string, try to parse it as JSON
                try {
                    platforms = JSON.parse(platforms);
                } catch (e) {
                    // If parsing fails, split the string by comma
                    platforms = platforms.split(',').map(p => p.trim());
                }
            }
            // If it's an array, filter out any empty strings
            if (Array.isArray(platforms)) {
                platforms = platforms.filter(p => p && p.trim() !== '');
            }
            // If the array is empty after filtering, return undefined
            return platforms.length > 0 ? platforms : undefined;
        };

        leadData.ecommerceListingPlatforms = sanitizePlatforms(leadData.ecommerceListingPlatforms);
        leadData.quickCommercePlatforms = sanitizePlatforms(leadData.quickCommercePlatforms);

        // Debugging: Log the sanitized data
        console.log('Sanitized lead data:', JSON.stringify(leadData, null, 2));

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
        await newLead.save();

        // Check if payment is due soon
        await checkPaymentDueSoon(newLead);

        // Respond with the created lead
        res.status(201).json(newLead);
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

        // Check if payment is due soon after update
        await checkPaymentDueSoon(updatedLead);

        res.json(updatedLead);
    } catch (error) {
        res.status(500).json({ message: 'Error updating lead', error: error.message });
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

const downloadProof = (req, res) => {
    const { filename } = req.params;
    console.log('Requested filename:', filename);

    const filePath = path.join(__dirname, '../../uploads', filename);
    console.log('Full file path:', filePath);

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error("File does not exist:", filePath);
            return res.status(404).send('File not found');
        }

        console.log('File exists, sending...');
        // File exists, send it
        res.download(filePath, filename, (err) => {
            if (err) {
                console.error("Error downloading the file:", err);
                res.status(500).send('Error downloading file');
            }
        });
    });
};

module.exports = {
    createLead,
    getLeads,
    getLeadsByBDA,
    updateLead,
    downloadProof,
    getNotifications
};