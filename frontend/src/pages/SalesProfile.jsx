import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableRow, 
  TableHead,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  Container,
  TablePagination,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'sonner';
import axios from 'axios';
import { API_URL } from '../config';
import LeadDetailsDialog from '../components/Sales/LeadDetailsDialog';
import EditLeadDialog from '../components/Sales/EditLeadDIalog';
import { useNavigate } from 'react-router-dom';

const SalesProfilePage = () => {
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editLead, setEditLead] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [packageFilter, setPackageFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    const userFromStorage = JSON.parse(localStorage.getItem('user'));
    setUser(userFromStorage);
  }, []);

  useEffect(() => {
    if (user) {
      fetchLeads();
    }
  }, [user]);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API_URL}/leads/bda?bdaName=${user.username}`);
      setLeads(response.data);
      setFilteredLeads(response.data);
    } catch (error) {
      toast.error('Failed to fetch leads');
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterLeads(term, packageFilter, companyFilter);
    setPage(0);
  };

  const handlePackageFilter = (event) => {
    const packageType = event.target.value;
    setPackageFilter(packageType);
    filterLeads(searchTerm, packageType, companyFilter);
    setPage(0);
  };

  const handleCompanyFilter = (event) => {
    const company = event.target.value;
    setCompanyFilter(company);
    filterLeads(searchTerm, packageFilter, company);
    setPage(0);
  };

  const filterLeads = (term, packageType, company) => {
    const filtered = leads.filter(lead => 
      (lead.companyName.toLowerCase().includes(term) ||
       lead.clientName.toLowerCase().includes(term) ||
       lead.clientEmail.toLowerCase().includes(term)) &&
      (packageType === '' || lead.packageType === packageType) &&
      (company === '' || lead.companyName === company)
    );
    setFilteredLeads(filtered);
  };

  const handleEditClick = (lead) => {
    setEditLead(lead);
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setEditLead(null);
  };

  const handleEditSave = async (field, value) => {
    try {
      const updatedLead = { ...editLead, [field]: value };
      await axios.put(`${API_URL}/leads/${editLead._id}`, updatedLead);
      toast.success('Lead updated successfully');
      fetchLeads();
      handleEditClose();
    } catch (error) {
      toast.error('Failed to update lead');
    }
  };

  const handleDetailsClick = (lead) => {
    setSelectedLead(lead);
    setIsDetailsDialogOpen(true);
  };

  const handleDetailsClose = () => {
    setIsDetailsDialogOpen(false);
    setSelectedLead(null);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const renderValue = (value) => value || "NA";

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  const uniquePackages = [...new Set(leads.map(lead => lead.packageType).filter(Boolean))];
  const uniqueCompanies = [...new Set(leads.map(lead => lead.companyName))];

  const paginatedLeads = filteredLeads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleBackClick} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sales Profile: {user.username}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Search leads"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                endAdornment: <SearchIcon color="action" />,
              }}
            />
            <FormControl fullWidth>
              <InputLabel>Package Type</InputLabel>
              <Select
                value={packageFilter}
                onChange={handlePackageFilter}
                label="Package Type"
              >
                <MenuItem value="">All</MenuItem>
                {uniquePackages.map(pkg => (
                  <MenuItem key={pkg} value={pkg}>{pkg}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Company</InputLabel>
              <Select
                value={companyFilter}
                onChange={handleCompanyFilter}
                label="Company"
              >
                <MenuItem value="">All</MenuItem>
                {uniqueCompanies.map(company => (
                  <MenuItem key={company} value={company}>{company}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Paper>
        <Paper elevation={3} sx={{ overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Client Name</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>Package/Services</TableCell>
                <TableCell>Payment Done</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedLeads.map((lead) => (
                <TableRow key={lead._id} hover>
                  <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{renderValue(lead.clientName)}</TableCell>
                  <TableCell>{renderValue(lead.companyName)}</TableCell>
                  <TableCell>{renderValue(lead.packageType || lead.servicesRequested?.join(', '))}</TableCell>
                  <TableCell>{renderValue(lead.paymentDone)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDetailsClick(lead)} color="primary">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditClick(lead)} color="secondary">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredLeads.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5]}
          />
        </Paper>
      </Container>

      <EditLeadDialog
        open={isEditDialogOpen}
        onClose={handleEditClose}
        lead={editLead}
        onSave={handleEditSave}
      />

      <LeadDetailsDialog
        open={isDetailsDialogOpen}
        onClose={handleDetailsClose}
        lead={selectedLead}
      />
    </Box>
  );
};

export default SalesProfilePage;