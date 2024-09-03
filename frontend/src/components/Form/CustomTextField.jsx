import React from 'react';
import { TextField } from '@mui/material';

const CustomTextField = ({
  label,
  name,
  value,
  onChange,
  multiline = false,
  rows,
  required = false,
  type = 'text',
  disabled = false, // Explicitly accept the disabled prop
}) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      type={type}
      fullWidth
      multiline={multiline}
      rows={multiline ? rows : undefined}
      disabled={disabled} // Pass the disabled prop to the TextField
      sx={{
        mb: 2,
        '& label': { color: disabled ? 'rgba(255, 255, 255, 0.5)' : 'white' },
        '& input, & textarea': {
          color: 'white',
          backgroundColor: disabled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: disabled ? 'rgba(255, 255, 255, 0.3)' : 'white' },
          '&:hover fieldset': { borderColor: disabled ? 'rgba(255, 255, 255, 0.3)' : 'white' },
          '&.Mui-focused fieldset': { borderColor: disabled ? 'rgba(255, 255, 255, 0.3)' : 'white' },
          '&.Mui-focused input, &.Mui-focused textarea': {
            backgroundColor: disabled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
          },
          '& input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 30px #1e1e1e inset !important',
            WebkitTextFillColor: 'white !important',
          },
          '& textarea:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 30px #1e1e1e inset !important',
            WebkitTextFillColor: 'white !important',
          },
        },
      }}
    />
  );
};

export default CustomTextField;
