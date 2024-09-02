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
} from '@mui/material';

const DataManagement = ({ filter, handleFilterChange, applyFilters, filteredLeads, resetFilter }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2, textAlign: isMobile ? 'center' : 'left', fontSize: isMobile ? '1.5rem' : '2rem' }}>
        Data Management
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              name="channelPartnerCode"
              label="Channel Partner Code"
              value={filter.channelPartnerCode}
              onChange={handleFilterChange}
              fullWidth
              size={isMobile ? 'small' : 'medium'}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="leadSource"
              label="Lead Source"
              value={filter.leadSource}
              onChange={handleFilterChange}
              fullWidth
              size={isMobile ? 'small' : 'medium'}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="leadInterest"
              label="Lead Interest"
              value={filter.leadInterest}
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
        <TableContainer component={Paper} sx={{ maxHeight: '70vh', overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ padding: isMobile ? '4px' : '16px' }}>Channel Partner Code</TableCell>
                <TableCell sx={{ padding: isMobile ? '4px' : '16px' }}>Lead Name</TableCell>
                {!isMobile && (
                  <>
                    <TableCell sx={{ padding: isMobile ? '4px' : '16px' }}>Contact Number</TableCell>
                    <TableCell sx={{ padding: isMobile ? '4px' : '16px' }}>Email</TableCell>
                  </>
                )}
                <TableCell sx={{ padding: isMobile ? '4px' : '16px' }}>Lead Source</TableCell>
                <TableCell sx={{ padding: isMobile ? '4px' : '16px' }}>Lead Interest</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((lead, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ padding: isMobile ? '4px' : '16px' }}>{lead.channelPartnerCode}</TableCell>
                  <TableCell sx={{ padding: isMobile ? '4px' : '16px' }}>{lead.leadName}</TableCell>
                  {!isMobile && (
                    <>
                      <TableCell sx={{ padding: isMobile ? '4px' : '16px' }}>{lead.contactNumber}</TableCell>
                      <TableCell sx={{ padding: isMobile ? '4px' : '16px' }}>{lead.email}</TableCell>
                    </>
                  )}
                  <TableCell sx={{ padding: isMobile ? '4px' : '16px' }}>{lead.leadSource}</TableCell>
                  <TableCell sx={{ padding: isMobile ? '4px' : '16px' }}>{lead.leadInterest}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
