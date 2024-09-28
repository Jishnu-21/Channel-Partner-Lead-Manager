import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, Button, TextField, CircularProgress, Card, CardContent,Chip } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import StatsCard from './StatsCard';
import PartnerSelector from './PartnerSelector';
import LeadsByPartnerChart from './LeadsByPartnerChart';
import OrdersByIndustryChart from './OrdersByIndustryChart';
import { downloadCSV } from './utils';
import { toast } from 'sonner';
import axios from 'axios';
import { API_URL } from '../../config';

const Dashboard = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [channelPartnerData, setChannelPartnerData] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState('');
  const [uniquePartners, setUniquePartners] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    console.log('API_URL:', API_URL);
    fetchLeads().catch(error => {
      console.error('Error in useEffect:', error);
      toast.error('Failed to load dashboard data.');
    });
  }, []);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching leads from:', `${API_URL}/leads/`);
      const response = await axios.get(`${API_URL}/leads/`);
      console.log('API Response:', response);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response data structure');
      }

      const leads = response.data;
      if (leads.length === 0) {
        toast.warning('No Orders found.');
        setSelectedLeads([]);
        setUniquePartners([]);
        setCompanies([]);
      } else {
        setSelectedLeads(leads);
        const partners = [...new Set(leads.map(lead => lead.bdaName).filter(Boolean))];
        setUniquePartners(partners);
        const uniqueCompanies = [...new Set(leads.map(lead => lead.companyName).filter(Boolean))];
        setCompanies(uniqueCompanies);
        processData(leads);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      if (error.response) {
        console.log('Error response:', error.response.data);
        toast.error(`Failed to fetch leads: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.log('Error request:', error.request);
        toast.error('Network error. Please check your connection and API_URL configuration.');
      } else {
        console.log('Error message:', error.message);
        toast.error(`An unexpected error occurred: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const processData = (leads) => {
    const filteredLeads = filterLeadsByDateRange(leads);
    const processedChannelData = processDataByKey(filteredLeads, 'bdaName');
    setChannelPartnerData(processedChannelData);
  };

  const processDataByKey = (data, key) => {
    const counts = {};
    data.forEach((lead) => {
      const date = new Date(lead.createdAt);
      if (!isNaN(date.getTime())) {
        const dateKey = getDateKey(date);
        const partnerKey = lead[key];
        if (!counts[dateKey]) counts[dateKey] = {};
        counts[dateKey][partnerKey] = (counts[dateKey][partnerKey] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([date, values]) => ({ date, ...values }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const filterLeadsByDateRange = (leads) => {
    if (!startDate && !endDate) return leads;
    return leads.filter((lead) => {
      const leadDate = new Date(lead.createdAt);
      if (startDate && leadDate < startDate) return false;
      if (endDate && leadDate > endDate) return false;
      return true;
    });
  };

  const handleEndDateChange = (date) => {
    if (startDate && date < startDate) {
      toast.error("End date cannot be less than start date.");
    } else {
      setEndDate(date);
      processData(selectedLeads);
    }
  };

  const handlePartnerChange = (event) => {
    setSelectedPartner(event.target.value);
    const filteredLeads = selectedLeads.filter(lead => 
      event.target.value === '' || lead.bdaName === event.target.value
    );
    processData(filteredLeads);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    processData(selectedLeads);
  };

  const getTotalLeads = (leads) => leads.length;
  const getShuruvat = (leads) => leads.filter(lead => lead.packages === 'Shuruvat').length;
  const getUnnati = (leads) => leads.filter(lead => lead.packages === 'Unnati').length;
  const getServices = (leads) => leads.filter(lead => !lead.packages || lead.packages === '').length;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (selectedLeads.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Dashboard
        </Typography>
        <Typography variant="body1">
          No Orders found. Please add some leads to view the dashboard.
        </Typography>
      </Container>
    );
  }

  const filteredLeads = filterLeadsByDateRange(selectedLeads);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <PartnerSelector 
            uniquePartners={uniquePartners} 
            selectedPartner={selectedPartner} 
            handlePartnerChange={handlePartnerChange} 
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            customInput={
              <TextField
                fullWidth
                label="Start Date"
                InputProps={{
                  readOnly: true,
                }}
              />
            }
            dateFormat="MMMM d, yyyy"
            placeholderText="Select Start Date"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            customInput={
              <TextField
                fullWidth
                label="End Date"
                InputProps={{
                  readOnly: true,
                }}
              />
            }
            dateFormat="MMMM d, yyyy"
            placeholderText="Select End Date"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Total Orders" value={getTotalLeads(filteredLeads)} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Shuruvat Packages" value={getShuruvat(filteredLeads)} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Unnati Packages" value={getUnnati(filteredLeads)} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
        <StatsCard title="Services" value={getServices(filteredLeads)} />
      </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Companies
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {companies.map((company, index) => (
                  <Chip key={index} label={company} />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <LeadsByPartnerChart 
            data={channelPartnerData} 
            title="Orders by BDA" 
            selectedPartner={selectedPartner}
            uniquePartners={uniquePartners}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <OrdersByIndustryChart data={filteredLeads} title="Orders by Industry" />
        </Grid>
      </Grid>

      <Box mt={4} textAlign="right">
        <Button variant="contained" color="primary" onClick={() => downloadCSV(channelPartnerData)}>
          Download CSV
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;