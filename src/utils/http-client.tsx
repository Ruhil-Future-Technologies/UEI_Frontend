import axios from 'axios';

export const httpClient = axios.create({
  baseURL: 'https://api.gyansetu.ai/',
  // baseURL: "http://127.0.0.1:5000/" || "http://localhost:3000",

  headers: {
    'Content-Type': 'application/json',
  },
});
