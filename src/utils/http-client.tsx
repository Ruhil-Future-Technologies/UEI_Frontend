import axios from 'axios';

export const httpClient = axios.create({
 // baseURL: 'https://2d8b-2405-201-301d-f896-f176-85e4-869e-64d5.ngrok-free.app/',
  baseURL: 'https://qaapi.gyansetu.ai/',
  // baseURL: "http://127.0.0.1:5000/" || "http://localhost:3000",

  headers: {
    'Content-Type': 'application/json',
  },
});
