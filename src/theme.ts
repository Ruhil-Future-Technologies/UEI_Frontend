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
      main: '#dc004e',
    },
   
    
  },
};


const muiTheme = createTheme(theme);

export default muiTheme;
