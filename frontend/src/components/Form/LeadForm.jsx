import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { toast } from 'sonner'; 
import { API_URL } from '../../config.jsx';
import BasicInfoForm from './BasicInfoForm';
import ServiceDetailsForm from './ServiceDetailForm.jsx';
import DeadlineForm from './DeadlineForm.jsx';
import PaymentDetailsForm from './PaymentDetailsForm.jsx';
import FinalDetailsForm from './FinalDetailsForm.jsx';

// Custom styled components for white labels with improved visibility
const WhiteStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    color: 'white',
    fontWeight: 'bold',
    '&.Mui-active': {
      color: theme.palette.primary.main,
    },
    '&.Mui-completed': {
      color: theme.palette.success.main,
    },
  },
  '& .MuiStepIcon-root': {
    color: 'rgba(255, 255, 255, 0.5)',
    '&.Mui-active': {
      color: theme.palette.primary.main,
    },
    '&.Mui-completed': {
      color: theme.palette.success.main,
    },
  },
}));

const WhiteStepper = styled(Stepper)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
    borderColor: theme.palette.primary.main,
  },
  '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
    borderColor: theme.palette.success.main,
  },
}));

const LeadForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [leadData, setLeadData] = useState({
    contactNumber: '',
    email: '',
    bdaName: '',
    companyName: '',
    clientName: '',
    clientEmail: '',
    clientDesignation: '',
    alternateContactNo: '',
    companyOffering: '',
    servicesRequested: [], // Ensure this is included
    socialMediaManagementRequirement: [],
    websiteDevelopmentRequirement: '',
    brandingRequirement: [],
    quotationFile: null,
    tentativeDeadlineByCustomer: '',
    tentativeDateGivenByBDAToCustomer: '',
    totalServiceFeesCharged: '',
    gstBill: '',
    amountWithoutGST: '',
    paymentDate: '',
    paymentDone: '',
    proofOfApprovalForPartialPayment: null,
    actualAmountReceived: '',
    pendingAmount: '',
    pendingAmountDueDate: '',
    paymentMode: '',
    servicePromisedByBDA: '',
    extraServiceRequested: '',
    importantInformation: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      const updatedArray = checked
        ? [...leadData[name], value]
        : leadData[name].filter(item => item !== value);
      setLeadData({ ...leadData, [name]: updatedArray });
    } else if (type === 'file') {
      setLeadData({ ...leadData, [name]: files[0] });
    } else {
      setLeadData({ ...leadData, [name]: value });
    }
  };

  const handleFileChange = (e, fieldName) => {
    setLeadData({ ...leadData, [fieldName]: e.target.files[0] });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(leadData).forEach(key => {
        if (key === 'quotationFile' || key === 'proofOfApprovalForPartialPayment') {
          formData.append(key, leadData[key]);
        } else if (Array.isArray(leadData[key])) {
          leadData[key].forEach(value => formData.append(`${key}[]`, value));
        } else if (key === 'tentativeDeadlineByCustomer' || key === 'tentativeDateGivenByBDAToCustomer' || key === 'paymentDate' || key === 'pendingAmountDueDate') {
          // Convert date strings to ISO format
          formData.append(key, new Date(leadData[key]).toISOString());
        } else {
          formData.append(key, leadData[key]);
        }
      });

      const response = await axios.post(`${API_URL}/leads`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Lead submitted successfully!');
      console.log('Lead created:', response.data);
      // Reset form fields and go back to first step
      setLeadData({
        contactNumber: '',
        email: '',
        bdaName: '',
        companyName: '',
        clientName: '',
        clientEmail: '',
        clientDesignation: '',
        alternateContactNo: '',
        companyOffering: '',
        servicesRequested: [],
        socialMediaManagementRequirement: [],
        websiteDevelopmentRequirement: '',
        brandingRequirement: [],
        quotationFile: null,
        tentativeDeadlineByCustomer: '',
        tentativeDateGivenByBDAToCustomer: '',
        totalServiceFeesCharged: '',
        gstBill: '',
        amountWithoutGST: '',
        paymentDate: '',
        paymentDone: '',
        proofOfApprovalForPartialPayment: null,
        actualAmountReceived: '',
        pendingAmount: '',
        pendingAmountDueDate: '',
        paymentMode: '',
        servicePromisedByBDA: '',
        extraServiceRequested: '',
        importantInformation: '',
      });
      setActiveStep(0);
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred while submitting the lead.');
      console.error('Error creating lead:', error);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <BasicInfoForm leadData={leadData} handleChange={handleChange} />;
      case 1:
        return (
          <ServiceDetailsForm 
            leadData={leadData} 
            handleChange={handleChange} 
            setLeadData={setLeadData} // Pass setLeadData to update servicesRequested
          />
        );
      case 2:
        return <PaymentDetailsForm leadData={leadData} handleChange={handleChange} />;
      case 3:
        return <DeadlineForm leadData={leadData} handleChange={handleChange} selectedServices={leadData.servicesRequested} />;
      case 4:
        return <FinalDetailsForm leadData={leadData} handleChange={handleChange} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={2}
      sx={{ 
        minHeight: '100vh', 
        bgcolor: 'transparent',
        paddingX: { xs: 1, sm: 2 },
      }}
    >
      <Container maxWidth="md">
        <Typography 
          variant="h5" 
          component="h1" 
          align="center" 
          gutterBottom 
          sx={{ 
            color: 'white', 
            fontSize: { xs: '1.2rem', sm: '1.5rem' }
          }}
        >
          Order Punching Form
        </Typography>
        <WhiteStepper activeStep={activeStep} sx={{ mb: 4 }}>
          <Step>
            <WhiteStepLabel>Basic Information</WhiteStepLabel>
          </Step>
          <Step>
            <WhiteStepLabel>Service Details</WhiteStepLabel>
          </Step>
          <Step>
            <WhiteStepLabel>Payment Details</WhiteStepLabel>
          </Step>
          <Step>
            <WhiteStepLabel>Deadline information</WhiteStepLabel>
          </Step>
          <Step>
            <WhiteStepLabel>Final Details</WhiteStepLabel>
          </Step>
        </WhiteStepper>
        <form onSubmit={handleSubmit} style={{ color: 'white' }}>
          {renderStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ color: 'white' }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={activeStep === 4 ? handleSubmit : handleNext}
              sx={{ 
                py: 1.5, 
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                backgroundColor: 'white', 
                color: 'black' 
              }}
            >
              {activeStep === 4 ? 'Submit' : 'Next'}
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  );
};

export default LeadForm;