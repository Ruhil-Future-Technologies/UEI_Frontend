import axios from 'axios';

export const httpClient = axios.create({
  baseURL: 'http://13.233.97.160:5000/',
 // baseURL: 'https://b954-2405-201-301d-f848-8d89-97ea-1441-5d71.ngrok-free.app/',
  // baseURL: "http://127.0.0.1:5000/" || "http://localhost:3000",
  //baseURL: 'https://qaapi.gyansetu.ai/',

  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '1',
  },
});
