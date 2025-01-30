import {
  FormControlLabel,
  Switch as MuiSwitch,
  Typography,
} from '@mui/material';
import React, { FunctionComponent } from 'react';
import '../Switch/switch.scss';
export const Switch: FunctionComponent<{
  isChecked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  activeColor?: string;
  inactiveColor?: string;
}> = ({ onChange, isChecked, label, disabled, activeColor, inactiveColor }) => (
  <FormControlLabel
    control={
      <MuiSwitch
        sx={{
          width: 40,
          height: 20,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: '2px',
            color: inactiveColor,
            '&.Mui-checked': {
              transform: 'translateX(20px)',
              color: activeColor,
              '& + .MuiSwitch-track': {
                backgroundColor: '#fff',
                opacity: 0.5,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            width: 16,
            height: 16,
            boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)',
          },
          '& .MuiSwitch-track': {
            borderRadius: 20,
            backgroundColor: '#fff',
            opacity: 0.5,
            border: '1px solid #ccc',
          },
        }}
        checked={isChecked}
        onChange={(_, v) => onChange(v)}
      />
    }
    label={
      <Typography
        variant="body1"
        style={{ fontSize: '14px', marginLeft: '5px' }}
      >
        {label}
      </Typography>
    }
    disabled={disabled}
  />
);
