// src/theme.ts

import { createTheme, ThemeOptions } from '@mui/material/styles';
//import { blue, pink } from '@mui/material/colors';

// Option 1: Using MUI's predefined color palettes
// const theme: ThemeOptions = {
//   palette: {
//     primary: {
//       main: blue[500], // You can choose any shade from MUI's color palette
//     },
//     secondary: {
//       main: pink[500],
//     },
//   },
// };

// Option 2: Using custom color codes

const theme: ThemeOptions = {
  palette: {
    primary: {
      main: '#9943ec', // Your desired primary color hex code
      light: '#faf5fe',
      dark: '#1E1E1E',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FFC107',
    },   
    success: {
      main: '#2E7D32', // Custom success color
    },
    error: {
      main: '#B3261E', // Custom error color
    },
    warning: {
      main: '#FF9800', // Custom warning color
    },
    info: {
      main: '#2196F3', // Custom info color
    },
  },
};

const muiTheme = createTheme(theme);

export default muiTheme;
