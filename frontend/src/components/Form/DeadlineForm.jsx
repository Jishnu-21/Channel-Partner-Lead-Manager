import React from 'react';
import { Grid, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomDateField = styled(TextField)({
  '& .MuiInputLabel-root': {
    color: 'white',
    '&.Mui-focused': {
      color: 'white',
    },
  },
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'white',
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
});

const DeadlineForm = ({ leadData, handleChange }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CustomDateField
          label="Tentative Deadline By Customer"
          name="tentativeDeadlineByCustomer"
          type="date"
          value={leadData.tentativeDeadlineByCustomer || ''}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CustomDateField
          label="Tentative Date Given By BDA To Customer"
          name="tentativeDateGivenByBDAToCustomer"
          type="date"
          value={leadData.tentativeDateGivenByBDAToCustomer || ''}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default DeadlineForm;