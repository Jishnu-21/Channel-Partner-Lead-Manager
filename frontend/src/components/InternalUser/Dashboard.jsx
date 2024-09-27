import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, Button, TextField, CircularProgress } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import StatsCard from './StatsCard';
import PartnerSelector from './PartnerSelector';
import LeadsByPartnerChart from './LeadsByPartnerChart';
import LeadsBySourceChart from './LeadsBySourceChart';
import { downloadCSV } from './utils';
import { toast } from 'sonner';
import axios from 'axios';
import { API_URL } from '../../config';

const Dashboard = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [channelPartnerData, setChannelPartnerData] = useState([]);
  const [leadSourceData, setLeadSourceData] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState('');
  const [uniquePartners, setUniquePartners] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeads().catch(error => {
      console.error('Error in useEffect:', error);
      toast.error('Failed to load dashboard data.');
    });
  }, []);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/leads/`);
      console.log('API Response:', response); // Debugging line
      const leads = response.data;
      if (!leads || leads.length === 0) {
        toast.warning('No leads found.');
        setSelectedLeads([]);
        setUniquePartners([]);
      } else {
        setSelectedLeads(leads);
        const partners = [...new Set(leads.map(lead => lead.bdaName))];
        setUniquePartners(partners);
        processData(leads);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      if (error.response) {
        console.log('Error response:', error.response.data);
        toast.error(`Failed to fetch leads: ${error.response.data.message}`);
      } else if (error.request) {
        console.log('Error request:', error.request);
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const processData = (leads) => {
    const filteredLeads = filterLeadsByDateRange(leads);
    const processedChannelData = processDataByKey(filteredLeads, 'bdaName');
    const processedLeadSourceData = processDataByKey(filteredLeads, 'leadSource');

    setChannelPartnerData(processedChannelData);
    setLeadSourceData(processedLeadSourceData);
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

  const getTopLeadSource = (leads) => {
    if (leads.length === 0) return 'No Data';
    const leadSources = leads.reduce((acc, lead) => {
      acc[lead.leadSource] = (acc[lead.leadSource] || 0) + 1;
      return acc;
    }, {});
    const topSource = Object.keys(leadSources).reduce((a, b) => (leadSources[a] > leadSources[b] ? a : b));
    return topSource || 'No Data';
  };

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
          No leads found. Please add some leads to view the dashboard.
        </Typography>
      </Container>
    );
  }

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
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard title="Total Leads" value={filterLeadsByDateRange(selectedLeads).length} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard title="Total Partners" value={uniquePartners.length} />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <StatsCard title="Top Lead Source" value={getTopLeadSource(filterLeadsByDateRange(selectedLeads))} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <LeadsByPartnerChart 
            data={channelPartnerData} 
            title="Leads by Channel Partner" 
            selectedPartner={selectedPartner}
            uniquePartners={uniquePartners}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <LeadsBySourceChart data={filterLeadsByDateRange(selectedLeads)} title="Leads by Source" />
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