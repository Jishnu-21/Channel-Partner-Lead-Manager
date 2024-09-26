import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Button,
  Typography,
} from '@mui/material';

const ServiceDetailsForm = ({ leadData, handleChange, handleFileChange, setLeadData }) => {
  const [selectionType, setSelectionType] = useState(''); // 'packages' or 'services'
  const [selectedServices, setSelectedServices] = useState([]);
  const [socialMediaRequirements, setSocialMediaRequirements] = useState([]);
  const [websiteDevelopmentRequirement, setWebsiteDevelopmentRequirement] = useState('');
  const [brandingRequirements, setBrandingRequirements] = useState([]);
  const [packageType, setPackageType] = useState('');

  const packages = ['Shuruvat', 'Unnati'];
  const packageTypes = ['Silver', 'Gold', 'Platinum'];
  const services = ['Social Media Management', 'Website Development', 'Branding', 'Performance Marketing', 'Lead Generation', 'SEO', 'ProductCreation', 'Graphics Design', 'Ecommerce'];
  const socialMediaPlatforms = ['Instagram', 'WhatsApp', 'Youtube', 'Pinterest', 'Linkedin', 'Other'];
  const brandingOptions = ['Logo Creation', 'Brand Positioning', 'Tagline and Slogan', 'Packing and Graphics', 'Other'];

  useEffect(() => {
    // Reset deadline-related fields when selection type changes
    setLeadData(prevData => ({
      ...prevData,
      websiteDevelopmentTime: '',
      brandingTime: '',
      socialMediaTime: '',
      packages: '',
      packageType: '',
      servicesRequested: [],
    }));
    setPackageType('');
    setSelectedServices([]);
  }, [selectionType, setLeadData]);

  const handleSelectionTypeChange = (event) => {
    setSelectionType(event.target.value);
  };

  const handleServiceChange = (event) => {
    const { value } = event.target;
    setSelectedServices(value);
    setLeadData(prevData => ({
      ...prevData,
      servicesRequested: value,
      websiteDevelopmentTime: '',
      brandingTime: '',
      socialMediaTime: '',
    }));
    setSocialMediaRequirements([]);
    setWebsiteDevelopmentRequirement('');
    setBrandingRequirements([]);
  };

  const handleSocialMediaChange = (event) => {
    const { value } = event.target;
    setSocialMediaRequirements(value);
    setLeadData(prevData => ({
      ...prevData,
      socialMediaManagementRequirement: value,
    }));
  };

  const handlePackageChange = (event) => {
    const { name, value } = event.target;
    setLeadData(prevData => ({
      ...prevData,
      [name]: value,
      packageType: '',
    }));
    setPackageType('');
  };

  const handlePackageTypeChange = (event) => {
    const { value } = event.target;
    setPackageType(value);
    setLeadData(prevData => ({
      ...prevData,
      packageType: value,
    }));
  };

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

  const menuProps = {
    PaperProps: {
      style: {
        backgroundColor: '#1e1e1e',
      },
    },
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined" sx={selectSx}>
          <InputLabel id="selection-type-label">Select Type</InputLabel>
          <Select
            labelId="selection-type-label"
            value={selectionType}
            onChange={handleSelectionTypeChange}
            label="Select Type"
            input={<OutlinedInput label="Select Type" />}
            MenuProps={menuProps}
          >
            <MenuItem value="packages" style={{ color: 'white' }}>Packages</MenuItem>
            <MenuItem value="services" style={{ color: 'white' }}>Services</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {selectionType === 'packages' && (
        <>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" sx={selectSx}>
              <InputLabel id="package-label">Select Package</InputLabel>
              <Select
                labelId="package-label"
                name="packages"
                value={leadData.packages || ''}
                onChange={handlePackageChange}
                input={<OutlinedInput label="Select Package" />}
                MenuProps={menuProps}
              >
                {packages.map((pkg) => (
                  <MenuItem key={pkg} value={pkg} style={{ color: 'white' }}>{pkg}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {(leadData.packages === 'Shuruvat' || leadData.packages === 'Unnati') && (
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" sx={selectSx}>
                <InputLabel id="package-type-label">Package Type</InputLabel>
                <Select
                  labelId="package-type-label"
                  name="packageType"
                  value={packageType}
                  onChange={handlePackageTypeChange}
                  input={<OutlinedInput label="Package Type" />}
                  MenuProps={menuProps}
                >
                  {packageTypes.map((type) => (
                    <MenuItem key={type} value={type} style={{ color: 'white' }}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </>
      )}

      {selectionType === 'services' && (
        <>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" sx={selectSx}>
              <InputLabel id="services-label">Services Requested</InputLabel>
              <Select
                labelId="services-label"
                multiple
                name="servicesRequested"
                value={selectedServices}
                onChange={handleServiceChange}
                input={<OutlinedInput label="Services Requested" />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={menuProps}
              >
                {services.map((service) => (
                  <MenuItem key={service} value={service} style={{ color: 'white' }}>
                    <Checkbox checked={selectedServices.indexOf(service) > -1} />
                    <ListItemText primary={service} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {selectedServices.includes('Social Media Management') && (
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" sx={selectSx}>
                <InputLabel id="social-media-label">Social Media Management Requirement</InputLabel>
                <Select
                  labelId="social-media-label"
                  multiple
                  name="socialMediaManagementRequirement"
                  value={socialMediaRequirements}
                  onChange={handleSocialMediaChange}
                  input={<OutlinedInput label="Social Media Management Requirement" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={menuProps}
                >
                  {socialMediaPlatforms.map((platform) => (
                    <MenuItem key={platform} value={platform} style={{ color: 'white' }}>
                      <Checkbox checked={socialMediaRequirements.indexOf(platform) > -1} />
                      <ListItemText primary={platform} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {selectedServices.includes('Website Development') && (
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" sx={selectSx}>
                <InputLabel id="website-development-label">Website Development Requirement</InputLabel>
                <Select
                  labelId="website-development-label"
                  name="websiteDevelopmentRequirement"
                  value={websiteDevelopmentRequirement}
                  onChange={(e) => {
                    setWebsiteDevelopmentRequirement(e.target.value);
                    setLeadData(prevData => ({
                      ...prevData,
                      websiteDevelopmentRequirement: e.target.value,
                    }));
                  }}
                  input={<OutlinedInput label="Website Development Requirement" />}
                  MenuProps={menuProps}
                >
                  <MenuItem value="React" style={{ color: 'white' }}>React</MenuItem>
                  <MenuItem value="Wordpress" style={{ color: 'white' }}>Wordpress</MenuItem>
                  <MenuItem value="Other" style={{ color: 'white' }}>Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}

          {selectedServices.includes('Branding') && (
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" sx={selectSx}>
                <InputLabel id="branding-label">Branding Requirement</InputLabel>
                <Select
                  labelId="branding-label"
                  multiple
                  name="brandingRequirement"
                  value={brandingRequirements}
                  onChange={(e) => {
                    setBrandingRequirements(e.target.value);
                    setLeadData(prevData => ({
                      ...prevData,
                      brandingRequirement: e.target.value,
                    }));
                  }}
                  input={<OutlinedInput label="Branding Requirement" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={menuProps}
                >
                  {brandingOptions.map((option) => (
                    <MenuItem key={option} value={option} style={{ color: 'white' }}>
                      <Checkbox checked={brandingRequirements.indexOf(option) > -1} />
                      <ListItemText primary={option} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </>
      )}

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
          <Typography variant="body2" sx={{ color: 'white', marginTop: '8px' }}>
            File selected: {leadData.quotationFile.name}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default ServiceDetailsForm;