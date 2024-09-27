import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const DataManagement = ({ filter, handleFilterChange, applyFilters, filteredLeads, resetFilter }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderBasicInfo = (lead) => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography variant="body2">BDA Name: {lead.bdaName}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="body2">Company Name: {lead.companyName}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="body2">Client Name: {lead.clientName}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="body2">Client Email: {lead.clientEmail}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="body2">Client Designation: {lead.clientDesignation}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="body2">Contact Number: {lead.contactNumber}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="body2">Alternate Contact: {lead.alternateContactNo}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2">Company's Business: {lead.companyOffering}</Typography>
      </Grid>
    </Grid>
  );

  const renderServiceDetails = (lead) => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="body2">Package: {lead.packages}</Typography>
      </Grid>
      {lead.packages && (
        <Grid item xs={12}>
          <Typography variant="body2">Package Type: {lead.packageType}</Typography>
        </Grid>
      )}
      {!lead.packages && (
        <>
          <Grid item xs={12}>
            <Typography variant="body2">Services Requested: {lead.servicesRequested.join(', ')}</Typography>
          </Grid>
          {lead.servicesRequested.includes('Social Media Management') && (
            <Grid item xs={12}>
              <Typography variant="body2">Social Media Platforms: {lead.socialMediaManagementRequirement.join(', ')}</Typography>
            </Grid>
          )}
          {lead.servicesRequested.includes('Website Development') && (
            <Grid item xs={12}>
              <Typography variant="body2">Website Development: {lead.websiteDevelopmentRequirement}</Typography>
            </Grid>
          )}
          {lead.servicesRequested.includes('Branding') && (
            <Grid item xs={12}>
              <Typography variant="body2">Branding Requirements: {lead.brandingRequirement.join(', ')}</Typography>
            </Grid>
          )}
        </>
      )}
      <Grid item xs={12}>
        <Typography variant="body2">Quotation File: {lead.quotationFile ? 'Uploaded' : 'Not uploaded'}</Typography>
      </Grid>
    </Grid>
  );

  const renderPaymentDetails = (lead) => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography variant="body2">Total Service Fees: {lead.totalServiceFeesCharged}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="body2">GST Bill: {lead.gstBill}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="body2">Amount Without GST: {lead.amountWithoutGST}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="body2">Payment Status: {lead.paymentDone}</Typography>
      </Grid>
      {lead.paymentDone !== 'Not Done' && (
        <>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">Payment Date: {lead.paymentDate}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">Amount Received: {lead.actualAmountReceived}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">Payment Mode: {lead.paymentMode}</Typography>
          </Grid>
          {lead.paymentDone === 'Partial Payment' && (
            <>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">Pending Amount: {lead.pendingAmount}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">Pending Amount Due Date: {lead.pendingAmountDueDate}</Typography>
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <Typography variant="body2">Payment Proof: {lead.paymentProof ? 'Uploaded' : 'Not uploaded'}</Typography>
          </Grid>
        </>
      )}
    </Grid>
  );

  const renderFinalDetails = (lead) => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="body2">Service Promised By BDA: {lead.servicePromisedByBDA}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2">Important Information: {lead.importantInformation}</Typography>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2, textAlign: isMobile ? 'center' : 'left', fontSize: isMobile ? '1.5rem' : '2rem' }}>
        Data Management
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              name="bdaName"
              label="BDA Name"
              value={filter.bdaName}
              onChange={handleFilterChange}
              fullWidth
              size={isMobile ? 'small' : 'medium'}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="companyName"
              label="Company Name"
              value={filter.companyName}
              onChange={handleFilterChange}
              fullWidth
              size={isMobile ? 'small' : 'medium'}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="packages"
              label="Package"
              value={filter.packages}
              onChange={handleFilterChange}
              fullWidth
              size={isMobile ? 'small' : 'medium'}
              sx={{ mb: 2 }}
            />
          </Grid>
        </Grid>
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} sx={{ mt: 2 }}>
          <Button variant="contained" onClick={applyFilters} sx={{ mb: isMobile ? 1 : 0, mr: isMobile ? 0 : 1 }}>
            Apply Filters
          </Button>
          <Button variant="outlined" onClick={resetFilter}>
            Reset Filters
          </Button>
        </Box>
      </Box>
      {filteredLeads.length > 0 ? (
        filteredLeads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((lead, index) => (
          <Accordion key={index} sx={{ mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                   <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span>{lead.companyName} - {lead.clientName} ({formatDate(lead.createdAt)})
                </span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Basic Information</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {renderBasicInfo(lead)}
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Service Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {renderServiceDetails(lead)}
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Payment Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {renderPaymentDetails(lead)}
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Final Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {renderFinalDetails(lead)}
                </AccordionDetails>
              </Accordion>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          No results found. Please try different filter criteria.
        </Typography>
      )}
      {filteredLeads.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredLeads.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Container>
  );
};

export default DataManagement;