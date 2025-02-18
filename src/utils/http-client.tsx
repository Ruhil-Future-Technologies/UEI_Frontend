import axios from 'axios';

export const httpClient = axios.create({
  //baseURL: 'http://65.2.168.53:5000/',
  baseURL: 'https://7587-2409-40c4-130-2e47-a504-3559-b6e6-7ddb.ngrok-free.app/',
 // baseURL: 'https://qaapi.gyansetu.ai/',
  // baseURL: "http://127.0.0.1:5000/" || "http://localhost:3000",
 
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '1',
  },
});
