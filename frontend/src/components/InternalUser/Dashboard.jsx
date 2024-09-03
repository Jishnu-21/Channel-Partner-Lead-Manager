import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid, 
  Card, 
  CardContent, 
  useTheme, 
  useMediaQuery,
  Box,
  Button
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = ({ selectedLeads, uniquePartners, selectedPartner, handlePartnerChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [timeRange, setTimeRange] = useState('weekly');
  
  const [channelPartnerData, setChannelPartnerData] = useState([]);
  const [leadSourceData, setLeadSourceData] = useState([]);

  useEffect(() => {
    const processData = (data, key) => {
      const counts = {};
      
      data.forEach(lead => {
        const date = new Date(lead.createdAt);
        if (!isNaN(date.getTime())) {
          const dateKey = getDateKey(date);

          if (!counts[dateKey]) counts[dateKey] = {};
          counts[dateKey][lead[key]] = (counts[dateKey][lead[key]] || 0) + 1;
        }
      });

      return Object.entries(counts).map(([date, values]) => ({
        date,
        ...values
      }));
    };

    const processedChannelData = processData(selectedLeads, 'channelPartnerCode');
    const processedLeadSourceData = processData(selectedLeads, 'leadSource');

    setChannelPartnerData(processedChannelData);
    setLeadSourceData(processedLeadSourceData);
  }, [selectedLeads, timeRange]);

  const getDateKey = (date) => {
    try {
      switch (timeRange) {
        case 'daily':
          return date.toISOString().split('T')[0];
        case 'weekly':
          const startOfWeek = new Date(date);
          startOfWeek.setDate(date.getDate() - date.getDay());
          return startOfWeek.toISOString().split('T')[0];
        case 'monthly':
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        default:
          return date.toISOString().split('T')[0];
      }
    } catch (error) {
      console.error('Error processing date:', date, error);
      return 'Invalid Date';
    }
  };
  
  const renderLineChart = (data, title) => {
    if (!data || data.length === 0) {
      return null;
    }

    const COLORS = [
      '#FF5733', // A vibrant orange-red
      '#33FF57', // A bright green
      '#3357FF', // A bold blue
      '#FF33A1', // A striking pink
      '#FFC300', // A warm yellow
      '#581845', // A deep purple
      '#C70039', // A rich red
      '#DAF7A6', // A light green
      '#900C3F', // A dark red
    ];

    return (
      <Card elevation={3} sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>{title}</Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 50, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: theme.palette.background.paper }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              {Object.keys(data[0]).filter(key => key !== 'date').map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={COLORS[index % COLORS.length]} // Use more distinct colors
                  strokeWidth={3} // Slightly thicker lines for better visibility
                  dot={{ stroke: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const renderPieChart = (data, title) => {
    if (!data || data.length === 0) {
      return null;
    }

    const pieData = Object.entries(data.reduce((acc, { leadSource }) => {
      acc[leadSource] = (acc[leadSource] || 0) + 1;
      return acc;
    }, {})).map(([name, value]) => ({ name, value }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4D4D'];

    return (
      <Card elevation={3} sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>{title}</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={pieData} 
                cx="50%" 
                cy="50%" 
                labelLine={false} 
                outerRadius={80} 
                fill="#8884d8" 
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: theme.palette.background.paper }}
                formatter={(value, name) => [`${value} leads`, name]}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  // Function to download CSV
  const downloadCSV = () => {
    const csvData = channelPartnerData.map(({ date, ...values }) => ({
      date,
      ...values,
    }));

    const csvRows = [
      ['Date', ...Object.keys(csvData[0] || {}).filter(key => key !== 'date')], // Header
      ...csvData.map(row => [row.date, ...Object.values(row).slice(1)]) // Rows
    ];

    const csvString = csvRows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'channel_partner_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>Dashboard</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="partner-select-label">Channel Partner</InputLabel>
            <Select
              labelId="partner-select-label"
              value={selectedPartner}
              onChange={handlePartnerChange}
              label="Channel Partner"
            >
              <MenuItem value="">All Partners</MenuItem>
              {uniquePartners.map((partner) => (
                <MenuItem key={partner} value={partner}>{partner}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="time-range-label">Time Range</InputLabel>
            <Select
              labelId="time-range-label"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
  <Grid item xs={12} sm={6} md={4}>
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Total Leads</Typography>
        <Typography variant="h3">{selectedLeads.length}</Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Total Partners</Typography>
        <Typography variant="h3">{uniquePartners.length}</Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={12} md={4}>
  <Card elevation={3}>
    <CardContent>
      <Typography variant="h6" gutterBottom>Top Lead Source</Typography>
      <Typography variant="h3">
        {(() => {
          // Check if "All Partners" is selected
          if (!selectedPartner) {
            // Calculate top lead source across all selected leads
            const leadSourceCounts = selectedLeads.reduce((acc, lead) => {
              acc[lead.leadSource] = (acc[lead.leadSource] || 0) + 1;
              return acc;
            }, {});

            if (Object.keys(leadSourceCounts).length === 0) return 'No Leads';

            const topLeadSource = Object.keys(leadSourceCounts).reduce((a, b) => leadSourceCounts[a] > leadSourceCounts[b] ? a : b);

            return `${topLeadSource} (${leadSourceCounts[topLeadSource]} leads)`;
          } else {
            // Calculate top lead source for the selected partner
            const leadsForPartner = selectedLeads.filter(lead => lead.channelPartnerCode === selectedPartner);

            if (leadsForPartner.length === 0) return 'No Leads';

            const leadSourceCounts = leadsForPartner.reduce((acc, lead) => {
              acc[lead.leadSource] = (acc[lead.leadSource] || 0) + 1;
              return acc;
            }, {});

            const topLeadSource = Object.keys(leadSourceCounts).reduce((a, b) => leadSourceCounts[a] > leadSourceCounts[b] ? a : b);

            return `${topLeadSource} (${leadSourceCounts[topLeadSource]} leads)`;
          }
        })()}
      </Typography>
    </CardContent>
  </Card>
</Grid>

</Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {renderLineChart(channelPartnerData, 'Leads by Channel Partner')}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderPieChart(selectedLeads, 'Leads by Source')}
        </Grid>
      </Grid>

      <Box mt={4} textAlign="right">
        <Button variant="contained" color="primary" onClick={downloadCSV}>
          Download CSV
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
