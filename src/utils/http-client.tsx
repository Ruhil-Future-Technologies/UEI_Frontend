import axios from 'axios';

export const httpClient = axios.create({
  baseURL: 'https://3a6d-152-59-147-11.ngrok-free.app/',
  //baseURL: 'http://65.2.179.133:5000/',
  // baseURL: "http://127.0.0.1:5000/" || "http://localhost:3000",
  //baseURL: 'https://qaapi.gyansetu.ai/',

  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '1',
  },
});
