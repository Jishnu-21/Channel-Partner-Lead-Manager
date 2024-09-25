const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    contactNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    bdaName: {
        type: String,
        enum: ['Deepak Wagh', 'Ashutosh Singh', 'Deboshree Nayak', 'Founder'],
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    clientName: {
        type: String,
        required: true,
    },
    clientEmail: {
        type: String,
        required: true,
    },
    clientDesignation: {
        type: String,
        required: true,
    },
    alternateContactNo: {
        type: String,
    },
    companyOffering: {
        type: String,
        required: true,
    },
    servicesRequested: {
        type: [String],
        enum: ['Social Media Management', 'Website Development', 'Branding', 'Performance Marketing', 'Lead Generation', 'SEO', 'ProductCreation', 'Graphics Design', 'Ecommerce'],
        required: true,
    },
    socialMediaManagementRequirement: {
        type: [String],
        enum: ['Instagram', 'WhatsApp', 'Youtube', 'Pinterest', 'Linkedin', 'Other'],
    },
    websiteDevelopmentRequirement: {
        type: String,
    },
    brandingRequirement: {
        type: [String],
        enum: ['Logo Creation', 'Brand Positioning', 'Tagline and Slogan', 'Packing and Graphics', 'Other'],
    },
    quotationFile: {
        type: String, // This will store the URL or path to the uploaded file
    },
    tentativeDeadlineByCustomer: {
        type: Date,
    },
    tentativeDateGivenByBDAToCustomer: {
        type: Date,
    },
    totalServiceFeesCharged: {
        type: Number,
        required: true,
    },
    gstBill: {
        type: String,
        enum: ['Yes', 'No'],
        required: true,
    },
    amountWithoutGST: {
        type: Number,
        required: true,
    },
    paymentDate: {
        type: Date,
        required: true,
    },
    paymentDone: {
        type: String,
        enum: ['Full In Advance', 'Partial Payment'],
        required: true,
    },
    proofOfApprovalForPartialPayment: {
        type: String, // This will store the URL or path to the uploaded image
    },
    actualAmountReceived: {
        type: Number,
        required: true,
    },
    pendingAmount: {
        type: Number,
        required: true,
    },
    pendingAmountDueDate: {
        type: Date,
    },
    paymentMode: {
        type: String,
        enum: ['Cash', 'CreditCard', 'Debit Card', 'UPI', 'NEFT', 'RTGS', 'IMPS'],
        required: true,
    },
    servicePromisedByBDA: {
        type: String,
        required: true,
    },
    extraServiceRequested: {
        type: String,
    },
    importantInformation: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Lead', leadSchema);