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

//import { ThemeProvider } from '@mui/material/styles';
import { ThemeProviderWrapper } from './ThemeProvider';
import StopSpeechOnRouteChange from '../src/Pages/Chat/StopSpeechOnRouteChange';
//import CssBaseline from '@mui/material/CssBaseline'; // Optional: Normalize styles
//import theme from './theme'; // Path to your theme.ts

// import 'bootstrap/dist/css/bootstrap.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
const token = localStorage.getItem('token');
const tokenExpiry = localStorage.getItem('tokenExpiry');
const isTokenExpired = () => {
  if (token && tokenExpiry) {
    const currentTime = Date.now();
    if (currentTime > parseInt(tokenExpiry)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

root.render(
  <ThemeProviderWrapper>
    <NameProvider>
      <BrowserRouter>
        {isTokenExpired() ? (
          ''
        ) : (
          <ToastContainer
            closeOnClick={false}
            closeButton={false}
            autoClose={3000}
            style={{ width: 'auto' }}
          />
        )}
        <StopSpeechOnRouteChange />
        <App />
      </BrowserRouter>
    </NameProvider>
  </ThemeProviderWrapper>,
);
reportWebVitals();
