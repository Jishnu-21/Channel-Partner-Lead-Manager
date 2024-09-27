import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const LeadDetailsDialog = ({ open, onClose, lead }) => {
  if (!lead) return null;

  const formatValue = (key, value) => {
    if (value == null) return '';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    if (key === 'totalServiceFeesCharged') return `₹${value}`;
    if (key === 'paymentDone')
    if (key === 'createdAt' || key === 'updatedAt') return new Date(value).toLocaleString();
    return value.toString();
  };

  const formatFieldName = (key) => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const relevantFields = Object.entries(lead).filter(([key, value]) => 
    key !== '_id' && key !== '__v' && value != null && value !== ''
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          Lead Details
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" gutterBottom color="primary">
          {lead.companyName} - {lead.clientName}
        </Typography>
        <Table>
          <TableBody>
            {relevantFields.map(([key, value]) => (
              <TableRow key={key} hover>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '30%' }}>
                  {formatFieldName(key)}
                </TableCell>
                <TableCell>{formatValue(key, value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeadDetailsDialog;