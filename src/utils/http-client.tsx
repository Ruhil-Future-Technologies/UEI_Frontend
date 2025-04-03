import axios from 'axios';

export const httpClient = axios.create({

  baseURL: 'https://uatapi.gyansetu.ai/',
  // baseURL: "http://127.0.0.1:5000/" || "http://localhost:3000",
//   baseURL: 'https://qaapi.gyansetu.ai/',

  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '1',
  },
});
