const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  // Basic Information
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

  companyIndustry: {
    type: String,
    required: true,
  },

  // Service Details
  packages: {
    type: String,
    enum: ['Shuruvat', 'Unnati',' '],
  },
  packageType: {
    type: String,
    enum: ['Silver', 'Gold', 'Platinum',' '],
  },
  servicesRequested: {
    type: [String],
    enum: ['Social Media Management', 'Website Development', 'Branding', 'Performance Marketing', 'Lead Generation', 'SEO', 'ProductCreation', 'Graphics Design', 'Ecommerce Listing','Quick Commerce'],
  },
  socialMediaManagementRequirement: {
    type: [String],
    enum: ['Instagram', 'WhatsApp', 'Youtube', 'Pinterest', 'Linkedin', 'Other'],
  },
  websiteDevelopmentRequirement: {
    type: String,
    enum: ['React', 'Wordpress', 'Other', ''],
  },
  brandingRequirement: {
    type: [String],
    enum: ['Logo Creation', 'Brand Positioning', 'Tagline and Slogan', 'Packing and Graphics', 'Other'],
  },
  quotationFile: {
    type: String, // This will store the URL or path to the uploaded file
  },

  // Payment Details
  totalServiceFeesCharged: {
    type: Number,
    required: true,
  },
  gstBill: {
    type: String,
    enum: ['Yes', 'No'],
  },
  amountWithoutGST: {
    type: Number,
  },
  paymentDate: {
    type: Date,
  },
  paymentDone: {
    type: String,
    enum: ['Full In Advance', 'Partial Payment', 'Not Done'],
    required: true,
  },
  actualAmountReceived: {
    type: Number,
  },
  pendingAmount: {
    type: Number,
  },
  pendingAmountDueDate: {
    type: Date,
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'CreditCard', 'Debit Card', 'UPI', 'NEFT', 'RTGS', 'IMPS',''],
  },
  paymentProof: {
    type: String, // This will store the URL or path to the uploaded file
  },

  // Deadline Information
  tentativeDeadlineByCustomer: {
    type: Date,
  },
  websiteDevelopmentTime: {
    type: Number,
  },
  brandingTime: {
    type: Number,
  },
  socialMediaTime: {
    type: Number,
  },

  // Final Details
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