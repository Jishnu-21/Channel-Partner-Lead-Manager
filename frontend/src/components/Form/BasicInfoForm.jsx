import React from 'react';
import { 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  OutlinedInput,
  useMediaQuery,
  useTheme,
  FormHelperText
} from '@mui/material';
import CustomTextField from './CustomTextField';

const BasicInfoForm = ({ leadData, handleChange, errors }) => {
  const bdaNames = ['Deepak Wagh', 'Ashutosh Singh', 'Deboshree Nayak', 'Founder'];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="BDA Email"
          name="email"
          value={leadData.email}
          onChange={handleChange}
          required
          type="email"
          error={!!errors.email}
          helperText={errors.email}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth variant="outlined" sx={selectSx} error={!!errors.bdaName}>
          <InputLabel id="bda-name-label">BDA Name</InputLabel>
          <Select
            labelId="bda-name-label"
            label="BDA Name"
            name="bdaName"
            value={leadData.bdaName}
            onChange={handleChange}
            required
            input={<OutlinedInput label="BDA Name" />}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: '#1e1e1e',
                },
              },
            }}
          >
            {bdaNames.map((name) => (
              <MenuItem key={name} value={name} style={{ color: 'white' }}>
                {name}
              </MenuItem>
            ))}
          </Select>
          {errors.bdaName && <FormHelperText>{errors.bdaName}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="Company Name"
          name="companyName"
          value={leadData.companyName}
          onChange={handleChange}
          required
          error={!!errors.companyName}
          helperText={errors.companyName}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="Client Name"
          name="clientName"
          value={leadData.clientName}
          onChange={handleChange}
          required
          error={!!errors.clientName}
          helperText={errors.clientName}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="Client Email"
          name="clientEmail"
          value={leadData.clientEmail}
          onChange={handleChange}
          required
          type="email"
          error={!!errors.clientEmail}
          helperText={errors.clientEmail}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="Client Designation"
          name="clientDesignation"
          value={leadData.clientDesignation}
          onChange={handleChange}
          required
          error={!!errors.clientDesignation}
          helperText={errors.clientDesignation}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="Contact Number"
          name="contactNumber"
          value={leadData.contactNumber}
          onChange={handleChange}
          required
          type="tel"
          error={!!errors.contactNumber}
          helperText={errors.contactNumber}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="Alternate Contact"
          name="alternateContactNo"
          value={leadData.alternateContactNo}
          onChange={handleChange}
          type="tel"
        />
      </Grid>
      <Grid item xs={12}>
        <CustomTextField
          label="Company's Business"
          name="companyOffering"
          value={leadData.companyOffering}
          onChange={handleChange}
          required
          error={!!errors.companyOffering}
          helperText={errors.companyOffering}
        />
      </Grid>
    </Grid>
  );
};

export default BasicInfoForm;