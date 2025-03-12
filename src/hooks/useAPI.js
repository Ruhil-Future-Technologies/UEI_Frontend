import { useContext, useState } from 'react';
// import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../utils/http-client';
import NameContext from '../Pages/Context/NameContext';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `${token}`,
    'Content-Type': 'multipart/form-data',
  };
  const STATIC_JWT_TOKEN =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0MDY0OTkxMywianRpIjoiMTczYTYzZTUtZTk5ZC00MzI1LTgzMmQtN2RmMmY5MzMwYzAzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjQ3ZmY4MzJmLTZlNzctNGI1OC1hOGEwLTE0YzBlYWU5M2NmOSIsIm5iZiI6MTc0MDY0OTkxMywiY3NyZiI6IjUzNzcyNmYxLTRhOTctNGNmOC1hYTA5LWUyYzBjNjcyN2Y0MyIsImV4cCI6MTc0MDY1NzExMywiZW1haWwiOiJzdHVkZW50YXR1bDFAeW9wbWFpbC5jb20iLCJwaG9uZSI6Ijc4NDY5MzIyMjIiLCJ1c2VyX3V1aWQiOiI0N2ZmODMyZi02ZTc3LTRiNTgtYThhMC0xNGMwZWFlOTNjZjkiLCJ1c2VyX3R5cGUiOiJzdHVkZW50IiwidXNlcl9zZWNyZXQiOiJzY3J5cHQ6MzI3Njg6ODoxJEZFYkRCR1pMdlRVa3N6VmgkMjViMWM2MWQ1NTI0YTEyMGE0ZWZhZDU4NjAyYzJjN2JmNGE1NjgxNDZkNjFjNjY1ODcwOTY5M2E5ODg3NDEzYjk4YWIyZDRmMjQyZThhZmYxYzFhYTk1N2EwNmE0Mjc2NzU3M2M1MDU3OThlYzA2NGQwOWQyYjAxNTkzZDUyNzgifQ.HLYDD6g6l4OznGobu5eobmdaM5-IH-RI7Ctqw2mjDPU';
  const context = useContext(NameContext);
  const { setProPercentage } = context;
  const synth = window?.speechSynthesis;
  const handlogout = () => {
    setProPercentage(0);
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('userid');
    localStorage.removeItem('pd');
    localStorage.removeItem('userdata');
    localStorage.removeItem('signupdata');
    localStorage.removeItem('user_uuid');
    localStorage.removeItem('menulist');
    localStorage.removeItem('menulist1');
    localStorage.removeItem('proFalg');
    localStorage.removeItem('loglevel');
    sessionStorage.removeItem('profileData');
    localStorage.removeItem('chatsaved');
    localStorage.removeItem('Profile_completion');
    localStorage.removeItem('Profile completion');
    localStorage.removeItem('tokenExpiry');
    synth.cancel();
    // logoutpro();
  };
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  const isTokenExpired = () => {
    if (token && tokenExpiry) {
      const currentTime = Date.now();
      if (currentTime > parseInt(tokenExpiry)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  const getData = async (url, id) => {
    if (isTokenExpired()) {
      handlogout();
      navigate('/');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const requestUrl = id ? `${url}?id=${id}` : url;
      const response = await httpClient.get(requestUrl, { headers });
      setLoading(false);
      return response?.data;
    } catch (error) {
      setError(error);
      setLoading(false);

        console.warn('Data not found, returning empty object.');
        return { data: [], code: error.response?.status, status: false,message:error.response.data.message }; // Prevents UI from breaking
      
     // throw error; // Re-throw other errors
    }
  };
  const getForRegistration = async (url) => {
    if (isTokenExpired()) {
      handlogout();
      navigate('/');
      return;
    }
    const headers = {
      Authorization: `${STATIC_JWT_TOKEN}`,
      'ngrok-skip-browser-warning': 1,
    };
    setLoading(true);
    setError(null);
    try {
      const requestUrl = url;
      const response = await httpClient.get(requestUrl, { headers });
      setLoading(false);

      return response?.data;
    } catch (error) {
      
      setError(error);
      setLoading(false);
      return { data: [], code: error.response?.status, status: false,message:error.response.data.message }; // Prevents UI from breaking

    }
  };

  const postData = async (url, data, redirectUrl = null) => {
    if (isTokenExpired()) {
      handlogout();
      navigate('/');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await httpClient.post(url, data, { headers });
      setLoading(false);
      if (redirectUrl) {
        navigate(redirectUrl);
      }
      return response.data;
    } catch (error) {
      setError(error);
      setLoading(false);
      return { data: [], code: error.response?.status, status: false,message:error.response.data.message }; // Prevents UI from breaking

    }
  };

  const postDataJson = async (url, data, redirectUrl = null) => {
    if (isTokenExpired()) {
      handlogout();
      navigate('/');
      return;
    }
    const headers = {
      Authorization: `${token}`,
    };
    setLoading(true);
    setError(null);

    try {
      const response = await httpClient.post(url, data, { headers });
      setLoading(false);
      if (redirectUrl) {
        navigate(redirectUrl);
      }
      return response.data;
    } catch (error) {
      setError(error);
      setLoading(false);
      return { data: [], code: error.response?.status, status: false,message:error.response.data.message }; // Prevents UI from breaking
    }
  };
  const postRegisterData = async (url, data, token = null) => {
    if (isTokenExpired()) {
      handlogout();
      navigate('/');
      return;
    }
    let headers;
    if (token != null) {
      headers = {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 1,
        'Content-Type': 'multipart/form-data',
      };
    } else {
      headers = {
        Authorization: `${STATIC_JWT_TOKEN}`,
        'ngrok-skip-browser-warning': 1,
        'Content-Type': 'multipart/form-data',
      };
    }
    setLoading(true);
    setError(null);

    try {
      const response = await httpClient.post(url, data, { headers });
      setLoading(false);

      return response.data;
    } catch (error) {
      setError(error);
      setLoading(false);
      return { data: [], code: error.response?.status, status: false,message:error.response.data.message }; // Prevents UI from breaking

    }
  };

  const putData = async (url, data, redirectUrl = null) => {
    if (isTokenExpired()) {
      handlogout();
      navigate('/');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const requestUrl = url;
      const response = await httpClient.put(requestUrl, data, {
        headers,
      });
      setLoading(false);
      if (redirectUrl) {
        navigate(redirectUrl);
      }
      return response.data;
    } catch (error) {
      setError(error);
      setLoading(false);
      return { data: [], code: error.response?.status, status: false,message:error.response.data.message }; // Prevents UI from breaking
    }
  };
  const putDataJson = async (url, data, redirectUrl = null) => {
    if (isTokenExpired()) {
      handlogout();
      navigate('/');
      return;
    }
    const headers = {
      Authorization: `${token}`,
    };
    setLoading(true);
    setError(null);
    try {
      const requestUrl = url;
      const response = await httpClient.put(requestUrl, data, {
        headers,
      });
      setLoading(false);
      if (redirectUrl) {
        navigate(redirectUrl);
      }
      return response.data;
    } catch (error) {
      setError(error);
      setLoading(false);
      return { data: [], code: error.response?.status, status: false,message:error.response.data.message }; // Prevents UI from breaking
    }
  };

  const putFileData = async (url, data, redirectUrl = null) => {
    if (isTokenExpired()) {
      handlogout();
      navigate('/');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const requestUrl = url;

      const response = await httpClient.put(requestUrl, data, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      if (redirectUrl) {
        navigate(redirectUrl);
      }
      return response.data;
    } catch (error) {
      setError(error);
      setLoading(false);
      return { data: [], code: error.response?.status, status: false,message:error.response.data.message }; // Prevents UI from breaking
    }
  };
  const deleteData = async (url, data, redirectUrl = null) => {
    if (isTokenExpired()) {
      handlogout();
      navigate('/');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await httpClient.delete(url, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
        data,
      });
      setLoading(false);
      if (redirectUrl) {
        navigate(redirectUrl);
      }
      return response?.data;
    } catch (error) {
      setError(error);
      setLoading(false);
      return { data: [], code: error.response?.status, status: false,message:error.response.data.message }; // Prevents UI from breaking
    }
  };

  const postFileData = async (url, data, redirectUrl = null) => {
    if (isTokenExpired()) {
      handlogout();
      navigate('/');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.post(url, data, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      if (redirectUrl) {
        navigate(redirectUrl);
      }
      return response?.data;
    } catch (error) {
      setError(error);
      setLoading(false);
      return { data: [], code: error.response?.status, status: false,message:error.response.data.message }; // Prevents UI from breaking
    }
  };

  const deleteFileData = async (url, payload) => {
    if (isTokenExpired()) {
      handlogout();
      navigate('/');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await httpClient.delete(url, {
        headers,
        data: JSON.stringify(payload),
      });
      setLoading(false);
      return response?.data;
    } catch (error) {
      setError(error);
      setLoading(false);
      return { data: [], code: error.response?.status, status: false,message:error.response.data.message }; // Prevents UI from breaking
    }
  };

  return {
    getData,
    getForRegistration,
    postData,
    putData,
    putDataJson,
    putFileData,
    postRegisterData,
    deleteData,
    postDataJson,
    postFileData,
    deleteFileData,
    loading,
    error,
  };
};

export default useApi;
