import React from 'react';
import { 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  OutlinedInput,
  Button
} from '@mui/material';
import CustomTextField from './CustomTextField';

const PaymentDetailsForm = ({ leadData, handleChange, handleFileChange }) => {
  const paymentModes = ['Cash', 'CreditCard', 'Debit Card', 'UPI', 'NEFT', 'RTGS', 'IMPS'];

  const selectSx = {
    mb: 2,
    '& label': { color: 'white' },
    '& .MuiSelect-select': {
      color: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
    '&.Mui-focused .MuiSelect-select': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    '& .MuiSvgIcon-root': { color: 'white' },
  };

  const dateFieldSx = {
    '& .MuiInputLabel-root': {
      color: 'white',
      transform: 'translate(14px, -9px) scale(0.75)',
      '&.Mui-focused': {
        color: 'white',
      },
    },
    '& .MuiOutlinedInput-root': {
      color: 'white',
      '& fieldset': {
        borderColor: 'white',
        borderWidth: '1px',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
    '& input::-webkit-calendar-picker-indicator': {
      filter: 'invert(1)',
    },
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="Total Service Fees Charged"
          name="totalServiceFeesCharged"
          type="number"
          value={leadData.totalServiceFeesCharged || ''}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth variant="outlined" sx={selectSx}>
          <InputLabel id="gst-bill-label">GST Bill</InputLabel>
          <Select
            labelId="gst-bill-label"
            label="GST Bill"
            name="gstBill"
            value={leadData.gstBill || ''}
            onChange={handleChange}
            required
            input={<OutlinedInput label="GST Bill" />}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: '#1e1e1e',
                },
              },
            }}
          >
            <MenuItem value="Yes" style={{ color: 'white' }}>Yes</MenuItem>
            <MenuItem value="No" style={{ color: 'white' }}>No</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="Amount Without GST"
          name="amountWithoutGST"
          type="number"
          value={leadData.amountWithoutGST || ''}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="Payment Date"
          name="paymentDate"
          type="date"
          value={leadData.paymentDate || ''}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          required
          sx={dateFieldSx}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth variant="outlined" sx={selectSx}>
          <InputLabel id="payment-done-label">Payment Done</InputLabel>
          <Select
            labelId="payment-done-label"
            label="Payment Done"
            name="paymentDone"
            value={leadData.paymentDone || ''}
            onChange={handleChange}
            required
            input={<OutlinedInput label="Payment Done" />}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: '#1e1e1e',
                },
              },
            }}
          >
            <MenuItem value="Full In Advance" style={{ color: 'white' }}>Full In Advance</MenuItem>
            <MenuItem value="Partial Payment" style={{ color: 'white' }}>Partial Payment</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="Actual Amount Received"
          name="actualAmountReceived"
          type="number"
          value={leadData.actualAmountReceived || ''}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="Pending Amount"
          name="pendingAmount"
          type="number"
          value={leadData.pendingAmount || ''}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="Pending Amount Due Date"
          name="pendingAmountDueDate"
          type="date"
          value={leadData.pendingAmountDueDate || ''}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          sx={dateFieldSx}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth variant="outlined" sx={selectSx}>
          <InputLabel id="payment-mode-label">Payment Mode</InputLabel>
          <Select
            labelId="payment-mode-label"
            label="Payment Mode"
            name="paymentMode"
            value={leadData.paymentMode || ''}
            onChange={handleChange}
            required
            input={<OutlinedInput label="Payment Mode" />}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: '#1e1e1e',
                },
              },
            }}
          >
            {paymentModes.map((mode) => (
              <MenuItem key={mode} value={mode} style={{ color: 'white' }}>{mode}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {leadData.paymentDone === 'Partial Payment' && (
        <Grid item xs={12}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="proof-of-approval"
            type="file"
            onChange={(e) => handleFileChange(e, 'proofOfApprovalForPartialPayment')}
          />
          <label htmlFor="proof-of-approval">
            <Button variant="contained" component="span">
              Upload Proof of Approval for Partial Payment
            </Button>
          </label>
          {leadData.proofOfApprovalForPartialPayment && (
            <p>File selected: {leadData.proofOfApprovalForPartialPayment.name}</p>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default PaymentDetailsForm;