import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/userSlice';
import axios from 'axios';
import { Button, TextField, Typography, Container, Paper, RadioGroup, FormControlLabel, Radio, Box, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('channelPartner');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem('token'); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    // Introduce a delay of 5 seconds before the actual login
    setTimeout(async () => {
      try {
        const response = await axios.post(`${API_URL}/users/login`, { email, password, userType });
        const { token } = response.data;

        dispatch(login({ userType, token }));
        localStorage.setItem('token', token);
        toast.success('Login successful!');

        setLoading(false);

        if (userType === 'channelPartner') {
          navigate('/channel-partner');
        } else if (userType === 'internalUser') {
          navigate('/internal-user');
        }
      } catch (error) {
        console.error('Login error:', error);
        setLoading(false);
        if (error.response) {
          toast.error(error.response.data.message || 'Login failed. Please check your credentials.');
        } else {
          toast.error('Login failed. Please try again later.');
        }
      }
    }, 1000);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      position: 'relative' 
    }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <RadioGroup 
            row 
            value={userType} 
            onChange={(e) => setUserType(e.target.value)}
            sx={{ justifyContent: 'center', marginBottom: 2 }} 
          >
            <FormControlLabel value="channelPartner" control={<Radio />} label="Channel Partner" />
            <FormControlLabel value="internalUser" control={<Radio />} label="Internal User" />
          </RadioGroup>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: 'blue' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </Box>
      </Paper>

      {/* Tooltip with example credentials */}
      <Tooltip 
        title={
          <div>
            <Typography variant="body2"><strong>Channel Partner:</strong> channelpartner1@example.com / password123</Typography>
            <Typography variant="body2"><strong>Channel Partner:</strong> channelpartner2@example.com / password123</Typography>
            <Typography variant="body2"><strong>Channel Partner:</strong> channelpartner45@example.com / password123</Typography>
            <Typography variant="body2"><strong>Internal User:</strong> internaluser77@example.com / userpassword</Typography>
          </div>
        } 
        placement="right" // Change placement to right to avoid top issues
        arrow
        sx={{ zIndex: 9999 }} // Ensure tooltip appears above other elements
      >
        <IconButton 
          sx={{ 
            position: 'absolute', 
            right: 10,  // Adjust right position as needed
            top: '72%', // Position it lower to avoid the top of the screen
            color: 'blue' 
          }}
        >
          <HelpOutline />
        </IconButton>
      </Tooltip>
    </Container>
  );
};

export default LoginPage;
