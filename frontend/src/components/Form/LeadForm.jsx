import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  MenuItem, 
  Typography, 
  Select, 
  FormControl, 
  InputLabel 
} from '@mui/material';
import axios from 'axios';
import { toast } from 'sonner'; 
import CustomTextField from './CustomTextField'; 
import { API_URL } from '../../config.jsx';

const LeadForm = () => {
  const [leadData, setLeadData] = useState({
    channelPartnerCode: '',
    leadName: '',
    contactNumber: '',
    email: '',
    leadSource: '',
    leadInterest: '',
    additionalNotes: '',
  });

  const leadSources = ['Social Media', 'Referral', 'Website', 'Advertisement', 'Event'];

  const handleChange = (e) => {
    setLeadData({
      ...leadData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/leads`, leadData); // Replace with your actual API endpoint
      toast.success('Lead submitted successfully!'); // Show success toast
      console.log('Lead created:', response.data);
      // Optionally reset the form after successful submission
      setLeadData({
        channelPartnerCode: '',
        leadName: '',
        contactNumber: '',
        email: '',
        leadSource: '',
        leadInterest: '',
        additionalNotes: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred while submitting the lead.'); // Show error toast
      console.error('Error creating lead:', error);
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
        bgcolor: 'transparent'  // Make the Box transparent
      }}
    >
      <Container maxWidth="sm">
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          gutterBottom 
          sx={{ color: 'white' }}
        >
          Lead Submission Form
        </Typography>
        <form onSubmit={handleSubmit} style={{ color: 'white' }}>
          <CustomTextField
            label="Channel Partner Code"
            name="channelPartnerCode"
            value={leadData.channelPartnerCode}
            onChange={handleChange}
            required
          />

          <CustomTextField
            label="Lead Name"
            name="leadName"
            value={leadData.leadName}
            onChange={handleChange}
            required
          />

          <CustomTextField
            label="Contact Number"
            name="contactNumber"
            value={leadData.contactNumber}
            onChange={handleChange}
            required
            type="number"
          />

          <CustomTextField
            label="Email"
            name="email"
            value={leadData.email}
            onChange={handleChange}
            required
            type="email"
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: 'white' }}>Lead Source</InputLabel>
            <Select
              label="Lead Source"
              name="leadSource"
              value={leadData.leadSource}
              onChange={handleChange}
              required
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '& .MuiSvgIcon-root': { color: 'white' },
                '& .MuiSelect-select': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:focus': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: 'rgba(0, 0, 0, 0.9)',
                    '& .MuiMenuItem-root': {
                      color: 'white',
                      '&.Mui-selected': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                      '&.Mui-selected:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
                    },
                  },
                },
              }}
            >
              {leadSources.map((source) => (
                <MenuItem key={source} value={source}>
                  {source}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <CustomTextField
            label="Lead Interest"
            name="leadInterest"
            value={leadData.leadInterest}
            onChange={handleChange}
            required
          />

          <CustomTextField
            label="Additional Notes"
            name="additionalNotes"
            value={leadData.additionalNotes}
            onChange={handleChange}
            multiline
            rows={4}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 2, fontSize: '1rem', backgroundColor: 'white', color: 'black' }}
          >
            Submit Lead
          </Button>
        </form>
      </Container>
    </Box>
  );
};

export default LeadForm;
