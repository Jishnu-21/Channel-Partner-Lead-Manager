import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Button, 
  TextField, 
  CircularProgress, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import StatsCard from './StatsCard';
import PartnerSelector from './PartnerSelector';
import { downloadCSV } from './utils';
import { toast } from 'sonner';
import axios from 'axios';
import { API_URL } from '../../config';

const PaymentDashboard = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState('');
  const [uniquePartners, setUniquePartners] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeads().catch(error => {
      console.error('Error in useEffect:', error);
      toast.error('Failed to load payment dashboard data.');
    });
  }, []);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/leads/`);
      const leads = response.data;
      if (leads.length === 0) {
        toast.warning('No payment data found.');
        setSelectedLeads([]);
        setUniquePartners([]);
      } else {
        setSelectedLeads(leads);
        const partners = [...new Set(leads.map(lead => lead.bdaName).filter(Boolean))];
        setUniquePartners(partners);
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
      toast.error('Failed to fetch payment data.');
    } finally {
      setIsLoading(false);
    }
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
    }
  };

  const handlePartnerChange = (event) => {
    setSelectedPartner(event.target.value);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const getTotalRevenue = (leads) => leads.reduce((sum, lead) => sum + (lead.actualAmountReceived || 0), 0);
  
  const getPendingAmount = (leads) => leads.reduce((sum, lead) => {
    const totalServiceFee = lead.totalServiceFeesCharged || 0;
    const actualAmountPaid = lead.actualAmountReceived || 0;
    return sum + (totalServiceFee - actualAmountPaid);
  }, 0);
  
  const getFullPayments = (leads) => leads.filter(lead => lead.paymentDone === 'Full In Advance').length;
  const getPartialPayments = (leads) => leads.filter(lead => lead.paymentDone === 'Partial Payment').length;

  const handleDownloadProof = (proofUrl) => {
    // Implement the download functionality here
    // This could be a direct download link or an API call to get the file
    console.log('Downloading proof:', proofUrl);
    // For example:
    // window.open(proofUrl, '_blank');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const filteredLeads = filterLeadsByDateRange(selectedLeads);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Payment Dashboard
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
            customInput={<TextField fullWidth label="Start Date" InputProps={{ readOnly: true }} />}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select Start Date"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            customInput={<TextField fullWidth label="End Date" InputProps={{ readOnly: true }} />}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select End Date"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Total Revenue" value={`₹${getTotalRevenue(filteredLeads).toFixed(2)}`} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Pending Amount" value={`₹${getPendingAmount(filteredLeads).toFixed(2)}`} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Full Payments" value={getFullPayments(filteredLeads)} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Partial Payments" value={getPartialPayments(filteredLeads)} />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Payment Details
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Total Service Fee</TableCell>
                  <TableCell>Amount Received</TableCell>
                  <TableCell>Pending Amount</TableCell>
                  <TableCell>Payment Status</TableCell>
                  <TableCell>Pending Payment Due Date</TableCell>
                  <TableCell>Payment Proof</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeads.map((lead, index) => (
                  <TableRow key={index}>
                    <TableCell>{lead.companyName}</TableCell>
                    <TableCell>₹{lead.totalServiceFeesCharged?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>₹{lead.actualAmountReceived?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>₹{(lead.totalServiceFeesCharged - lead.actualAmountReceived).toFixed(2)}</TableCell>
                    <TableCell>{lead.paymentDone}</TableCell>
                    <TableCell>{formatDate(lead.pendingAmountDueDate)}</TableCell>
                    <TableCell>
                      {lead.paymentProofUrl ? (
                        <Button 
                          variant="contained" 
                          size="small" 
                          onClick={() => handleDownloadProof(lead.paymentProofUrl)}
                        >
                          Download Proof
                        </Button>
                      ) : 'No proof available'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Box mt={4} textAlign="right">
        <Button variant="contained" color="primary" onClick={() => downloadCSV(filteredLeads)}>
          Download CSV
        </Button>
      </Box>
    </Container>
  );
};

export default PaymentDashboard;