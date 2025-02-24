import axios from 'axios';

export const httpClient = axios.create({
 // baseURL: 'http://65.2.179.133:5000/',
  baseURL: 'https:\a8aa-152-59-147-11.ngrok-free.app',
 // baseURL: 'https://qaapi.gyansetu.ai/',
  // baseURL: "http://127.0.0.1:5000/" || "http://localhost:3000",
 
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '1',
  },
});
