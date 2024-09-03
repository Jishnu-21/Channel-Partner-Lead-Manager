import React, { useState, useEffect } from 'react';
import { Box, Button, Container, MenuItem, Typography, Select, FormControl, InputLabel } from '@mui/material';
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

  const [channelPartnerCode, setChannelPartnerCode] = useState('');
  const token = localStorage.getItem('token'); 
  const leadSources = ['Social Media', 'Referral', 'Website', 'Advertisement', 'Event'];

  useEffect(() => {
    const fetchChannelPartnerCode = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/cp`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChannelPartnerCode(response.data.channelPartnerCode);
        setLeadData((prevData) => ({
          ...prevData,
          channelPartnerCode: response.data.channelPartnerCode,
        }));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch channel partner code.');
        console.error('Error fetching channel partner code:', error);
      }
    };

    if (token) fetchChannelPartnerCode();
  }, [token]);

  const handleChange = (e) => {
    setLeadData({ ...leadData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/leads`, leadData);
      toast.success('Lead submitted successfully!');
      setLeadData({
        channelPartnerCode: channelPartnerCode, // Retain the fetched code
        leadName: '',
        contactNumber: '',
        email: '',
        leadSource: '',
        leadInterest: '',
        additionalNotes: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred while submitting the lead.');
      console.error('Error creating lead:', error);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" p={2} sx={{ minHeight: '100vh', bgcolor: 'transparent', paddingX: { xs: 2, sm: 4 } }}>
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ color: 'white', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Lead Submission Form
        </Typography>
        <form onSubmit={handleSubmit} style={{ color: 'white' }}>
          <CustomTextField
            label="Channel Partner Code"
            name="channelPartnerCode"
            value={leadData.channelPartnerCode}
            onChange={handleChange}
            required
            disabled // Disable the input so it cannot be edited
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
            sx={{ py: 2, fontSize: { xs: '0.8rem', sm: '1rem' }, backgroundColor: 'white', color: 'black' }}
          >
            Submit Lead
          </Button>
        </form>
      </Container>
    </Box>
  );
};

export default LeadForm;
