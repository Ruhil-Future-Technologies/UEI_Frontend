import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
// import '../src/assets/css/style.scss';
import '../src/assets/css/newstyle.scss';
import '../src/assets/css/main.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NameProvider } from './Pages/Context/NameContext';

import { ThemeProvider } from '@mui/material/styles';
//import CssBaseline from '@mui/material/CssBaseline'; // Optional: Normalize styles
import theme from './theme'; // Path to your theme.ts

// import 'bootstrap/dist/css/bootstrap.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ThemeProvider theme={theme}>
  <NameProvider> 
     <BrowserRouter>
   <ToastContainer closeOnClick={false} closeButton={false} autoClose={3000} style={{width:"auto"}}/>
    <App />
  </BrowserRouter>
  </NameProvider>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
