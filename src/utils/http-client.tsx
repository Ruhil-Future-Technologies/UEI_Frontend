import axios from 'axios';

export const httpClient = axios.create({
  baseURL: 'https://6aa5-2405-201-301d-f896-2caf-3378-5b1c-2f20.ngrok-free.app/',
 // baseURL: 'https://qaapi.gyansetu.ai/',
  // baseURL: "http://127.0.0.1:5000/" || "http://localhost:3000",

  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '1',
  },
});
