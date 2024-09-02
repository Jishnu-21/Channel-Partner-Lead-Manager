import React, { useState } from 'react';
import LeadForm from '../components/Form/LeadForm';
import LogoutButton from '../components/LogoutButton';
import ProtectedRoute from '../components/ProtectedRoute'; // Import ProtectedRoute
import { useTheme, useMediaQuery, IconButton, Menu, MenuItem } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout'; // Import Logout icon

const Homepage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen is mobile
  const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor

  const backgroundStyle = {
    backgroundImage: 'url("sl_0210121_40570_43.jpg")', // Background image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Position for absolute children
  };

  const buttonStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Open menu
  };

  const handleClose = () => {
    setAnchorEl(null); // Close menu
  };

  return (
    <ProtectedRoute requiredType="channelPartner"> {/* Adjust requiredType based on your logic */}
      <div style={backgroundStyle}>
        <LeadForm />
        {/* Conditional rendering for mobile */}
        {isMobile ? (
          <div style={buttonStyle}>
            <IconButton onClick={handleClick} color="primary">
              <LogoutIcon /> {/* Logout icon */}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)} // Check if the menu should be open
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <LogoutButton /> {/* Logout button in the menu */}
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <div style={buttonStyle}>
            <LogoutButton /> {/* Regular logout button for desktop */}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Homepage;
