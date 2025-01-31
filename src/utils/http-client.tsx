import axios from 'axios';

export const httpClient = axios.create({
 // baseURL: 'https://c05a-2409-40c4-35c-61af-319b-8529-76ad-fb3a.ngrok-free.app/',
  baseURL: 'https://qaapi.gyansetu.ai/',
  // baseURL: "http://127.0.0.1:5000/" || "http://localhost:3000",

  headers: {
    'Content-Type': 'application/json',
  },
});
