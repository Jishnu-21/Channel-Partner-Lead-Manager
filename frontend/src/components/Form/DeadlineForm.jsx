import React from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
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

// Extracted dropdown style for dark theme
const selectSx = {
  mb: 2,
  '& label': { color: 'white' },
  '& .MuiSelect-select': {
    color: 'white',
    backgroundColor: 'rgba(30, 30, 30, 0.8)', // Dark background
  },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
  '&.Mui-focused .MuiSelect-select': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Match the hover color
  },
  '& .MuiSvgIcon-root': { color: 'white' },
};

const timePeriods = [30, 45, 60, 90]; // Time periods in days

const DeadlineForm = ({ leadData, handleChange, selectedServices }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CustomDateField
          label="Start Date By Customer"
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

      {selectedServices.includes('Website Development') && (
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" sx={selectSx}>
            <InputLabel id="website-development-time-label">Website Development Time Period</InputLabel>
            <Select
              labelId="website-development-time-label"
              name="websiteDevelopmentTime"
              value={leadData.websiteDevelopmentTime || ''}
              onChange={handleChange}
              label="Website Development Time Period"
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: '#1e1e1e', // Dark background for the dropdown menu
                  },
                },
              }}
            >
              {timePeriods.map((period) => (
                <MenuItem key={period} value={period} style={{ color: 'white' }}>
                  {period} days
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}

      {selectedServices.includes('Branding') && (
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" sx={selectSx}>
            <InputLabel id="branding-time-label">Branding Time Period</InputLabel>
            <Select
              labelId="branding-time-label"
              name="brandingTime"
              value={leadData.brandingTime || ''}
              onChange={handleChange}
              label="Branding Time Period"
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: '#1e1e1e', // Dark background for the dropdown menu
                  },
                },
              }}
            >
              {timePeriods.map((period) => (
                <MenuItem key={period} value={period} style={{ color: 'white' }}>
                  {period} days
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}

      {selectedServices.includes('Social Media Management') && (
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" sx={selectSx}>
            <InputLabel id="social-media-time-label">Social Media Marketing Time Period</InputLabel>
            <Select
              labelId="social-media-time-label"
              name="socialMediaTime"
              value={leadData.socialMediaTime || ''}
              onChange={handleChange}
              label="Social Media Marketing Time Period"
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: '#1e1e1e', // Dark background for the dropdown menu
                  },
                },
              }}
            >
              {timePeriods.map((period) => (
                <MenuItem key={period} value={period} style={{ color: 'white' }}>
                  {period} days
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
    </Grid>
  );
};

export default DeadlineForm;