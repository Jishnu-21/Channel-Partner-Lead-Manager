import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, Button, TextField } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the CSS for styling
import StatsCard from './StatsCard';
import PartnerSelector from './PartnerSelector';
import LeadsByPartnerChart from './LeadsByPartnerChart';
import LeadsBySourceChart from './LeadsBySourceChart';
import { downloadCSV } from './utils';

const Dashboard = ({ selectedLeads, uniquePartners, selectedPartner, handlePartnerChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [channelPartnerData, setChannelPartnerData] = useState([]);
  const [leadSourceData, setLeadSourceData] = useState([]);

  useEffect(() => {
    const processData = (data, key) => {
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

    const filteredLeads = filterLeadsByDateRange(selectedLeads);
    const processedChannelData = processData(filteredLeads, 'channelPartnerCode');
    const processedLeadSourceData = processData(filteredLeads, 'leadSource');

    setChannelPartnerData(processedChannelData);
    setLeadSourceData(processedLeadSourceData);
  }, [selectedLeads, startDate, endDate]);

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

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <PartnerSelector uniquePartners={uniquePartners} selectedPartner={selectedPartner} handlePartnerChange={handlePartnerChange} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Start Date" value={startDate ? startDate.toLocaleDateString() : ''} readOnly />
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="MMMM d, yyyy"
            className="date-picker"
            placeholderText="Select Start Date"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField fullWidth label="End Date" value={endDate ? endDate.toLocaleDateString() : ''} readOnly />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="MMMM d, yyyy"
            className="date-picker"
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

const getTopLeadSource = (leads) => {
  if (leads.length === 0) return 'No Data';
  const leadSources = leads.reduce((acc, lead) => {
    acc[lead.leadSource] = (acc[lead.leadSource] || 0) + 1;
    return acc;
  }, {});
  const topSource = Object.keys(leadSources).reduce((a, b) => (leadSources[a] > leadSources[b] ? a : b));
  return topSource || 'No Data';
};

export default Dashboard;
