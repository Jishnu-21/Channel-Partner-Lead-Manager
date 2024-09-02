const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    channelPartnerCode: {
        type: String,
        required: true,
    },
    leadName: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    leadSource: {
        type: String,
        enum: ['Social Media', 'Referral', 'Website', 'Advertisement', 'Event'],
        required: true,
    },
    leadInterest: {
        type: String,
        required: true,
    },
    additionalNotes: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Lead', leadSchema);
