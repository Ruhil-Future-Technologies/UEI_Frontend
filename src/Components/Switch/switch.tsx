import {
  FormControlLabel,
  Switch as MuiSwitch,
  Typography,
} from "@mui/material";
import React, { FunctionComponent } from "react";
import "../Switch/switch.scss";
export const Switch: FunctionComponent<{
  isChecked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void ;
  label?: string;
}> = ({ onChange, isChecked, label, disabled }) => (
  <FormControlLabel
    control={<MuiSwitch  sx={{
      '& .MuiSwitch-switchBase': {
        color: 'var(--buttonbgcolor)', // Use CSS variable here
      },
      '& .MuiSwitch-track': {
        backgroundColor: 'var(--buttonbgcolor)', // Use CSS variable here
      },
      '& .MuiSwitch-thumb': {
        color:'var(--buttonbgcolor)', // Example thumb color
      },
      '& .MuiSwitch-switchBase.Mui-checked': {
        color: 'var(--buttonbgcolor)', // Color when checked
      },
      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: 'var(--buttonbgcolor)', // Track color when checked
      },
    }}  checked={isChecked} onChange={(_, v) => onChange(v)} />}
    label={
      <Typography variant="body1" style={{ fontSize: "14px" }}>
        {label}
      </Typography>
    }
    disabled={disabled}
  />
);
