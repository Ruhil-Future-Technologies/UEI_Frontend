import axios from "axios";

export const httpClient = axios.create({

  // baseURL: "http://13.201.89.65:5000/" || "http://localhost:3000",
  // baseURL: "https://13.235.239.244/" || "http://localhost:3000",
  baseURL: "https://qaapi.gyansetu.ai/",
  // baseURL: "http://127.0.0.1:5000/" || "http://localhost:3000", 

  headers: {
    "Content-Type": "application/json",
  },
});

