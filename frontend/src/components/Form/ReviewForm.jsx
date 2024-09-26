import React, { useState } from 'react';
import { Typography, Box, Button, Grid, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const ReviewForm = ({ leadData, setLeadData, setActiveStep }) => {
  const [editingSection, setEditingSection] = useState(null);

  const handleEdit = (section) => {
    setEditingSection(section);
  };

  const handleSave = () => {
    setEditingSection(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeadData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const renderField = (key, value, section) => {
    const isEditing = editingSection === section;
    return (
      <Grid item xs={12} sm={6} key={key}>
        <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
        </Typography>
        {isEditing ? (
          <TextField
            name={key}
            value={value || ''}
            onChange={handleChange}
            fullWidth
            sx={{
              input: { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
              },
            }}
          />
        ) : (
          <Typography sx={{ color: 'white' }}>
            {Array.isArray(value) ? value.join(', ') : (value?.toString() || 'N/A')}
          </Typography>
        )}
      </Grid>
    );
  };

  const renderSection = (title, data, section) => (
    <Box mb={4}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" sx={{ color: 'white' }}>{title}</Typography>
        {editingSection === section ? (
          <IconButton onClick={handleSave} sx={{ color: 'white' }}>
            <SaveIcon />
          </IconButton>
        ) : (
          <IconButton onClick={() => handleEdit(section)} sx={{ color: 'white' }}>
            <EditIcon />
          </IconButton>
        )}
      </Box>
      <Grid container spacing={2}>
        {Object.entries(data).map(([key, value]) => renderField(key, value, section))}
      </Grid>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ color: 'white', mb: 4 }}>Review Your Information</Typography>
      
      {renderSection('Basic Information', {
        email: leadData.email,
        bdaName: leadData.bdaName,
        companyName: leadData.companyName,
        clientName: leadData.clientName,
        clientEmail: leadData.clientEmail,
        clientDesignation: leadData.clientDesignation,
        contactNumber: leadData.contactNumber,
        alternateContactNo: leadData.alternateContactNo,
        companyOffering: leadData.companyOffering,
      }, 'basic')}

      {renderSection('Service Details', {
        servicesRequested: leadData.servicesRequested,
        socialMediaManagementRequirement: leadData.socialMediaManagementRequirement,
        websiteDevelopmentRequirement: leadData.websiteDevelopmentRequirement,
        brandingRequirement: leadData.brandingRequirement,
        quotationFile: leadData.quotationFile ? leadData.quotationFile.name : 'No file uploaded',
      }, 'service')}

      {renderSection('Payment Details', {
        totalServiceFeesCharged: leadData.totalServiceFeesCharged,
        gstBill: leadData.gstBill,
        amountWithoutGST: leadData.amountWithoutGST,
        paymentDate: leadData.paymentDate,
        paymentDone: leadData.paymentDone,
        proofOfApprovalForPartialPayment: leadData.proofOfApprovalForPartialPayment ? leadData.proofOfApprovalForPartialPayment.name : 'No file uploaded',
        actualAmountReceived: leadData.actualAmountReceived,
        pendingAmount: leadData.pendingAmount,
        pendingAmountDueDate: leadData.pendingAmountDueDate,
        paymentMode: leadData.paymentMode,
      }, 'payment')}

      {renderSection('Deadline Information', {
        tentativeDeadlineByCustomer: leadData.tentativeDeadlineByCustomer,
        tentativeDateGivenByBDAToCustomer: leadData.tentativeDateGivenByBDAToCustomer,
      }, 'deadline')}

      {renderSection('Final Details', {
        servicePromisedByBDA: leadData.servicePromisedByBDA,
        extraServiceRequested: leadData.extraServiceRequested,
        importantInformation: leadData.importantInformation,
      }, 'final')}

    </Box>
  );
};

export default ReviewForm;