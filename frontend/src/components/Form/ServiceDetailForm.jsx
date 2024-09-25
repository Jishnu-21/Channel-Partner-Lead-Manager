import React from 'react';
import { 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Button
} from '@mui/material';
import CustomTextField from './CustomTextField';

const ServiceDetailsForm = ({ leadData, handleChange, handleFileChange }) => {
  const services = ['Social Media Management', 'Website Development', 'Branding', 'Performance Marketing', 'Lead Generation', 'SEO', 'ProductCreation', 'Graphics Design', 'Ecommerce'];
  const socialMediaPlatforms = ['Instagram', 'WhatsApp', 'Youtube', 'Pinterest', 'Linkedin', 'Other'];
  const brandingOptions = ['Logo Creation', 'Brand Positioning', 'Tagline and Slogan', 'Packing and Graphics', 'Other'];

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
      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined" sx={selectSx}>
          <InputLabel id="services-label">Services Requested</InputLabel>
          <Select
            labelId="services-label"
            multiple
            name="servicesRequested"
            value={leadData.servicesRequested}
            onChange={handleChange}
            input={<OutlinedInput label="Services Requested" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: '#1e1e1e',
                },
              },
            }}
          >
            {services.map((service) => (
              <MenuItem key={service} value={service}>
                <Checkbox checked={leadData.servicesRequested.indexOf(service) > -1} />
                <ListItemText primary={service} style={{ color: 'white' }} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined" sx={selectSx}>
          <InputLabel id="social-media-label">Social Media Management Requirement</InputLabel>
          <Select
            labelId="social-media-label"
            multiple
            name="socialMediaManagementRequirement"
            value={leadData.socialMediaManagementRequirement}
            onChange={handleChange}
            input={<OutlinedInput label="Social Media Management Requirement" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: '#1e1e1e',
                },
              },
            }}
          >
            {socialMediaPlatforms.map((platform) => (
              <MenuItem key={platform} value={platform}>
                <Checkbox checked={leadData.socialMediaManagementRequirement.indexOf(platform) > -1} />
                <ListItemText primary={platform} style={{ color: 'white' }} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <CustomTextField
          label="Website Development Requirement"
          name="websiteDevelopmentRequirement"
          value={leadData.websiteDevelopmentRequirement}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
        />
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined" sx={selectSx}>
          <InputLabel id="branding-label">Branding Requirement</InputLabel>
          <Select
            labelId="branding-label"
            multiple
            name="brandingRequirement"
            value={leadData.brandingRequirement}
            onChange={handleChange}
            input={<OutlinedInput label="Branding Requirement" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: '#1e1e1e',
                },
              },
            }}
          >
            {brandingOptions.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox checked={leadData.brandingRequirement.indexOf(option) > -1} />
                <ListItemText primary={option} style={{ color: 'white' }} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <input
          accept="image/*,application/pdf"
          style={{ display: 'none' }}
          id="quotation-file"
          type="file"
          onChange={handleFileChange}
          name="quotationFile"
        />
        <label htmlFor="quotation-file">
          <Button 
            variant="contained" 
            component="span" 
            fullWidth
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            Upload Quotation (PDF or Image)
          </Button>
        </label>
        {leadData.quotationFile && (
          <p style={{ color: 'white', marginTop: '8px' }}>File selected: {leadData.quotationFile.name}</p>
        )}
      </Grid>
    </Grid>
  );
};

export default ServiceDetailsForm;