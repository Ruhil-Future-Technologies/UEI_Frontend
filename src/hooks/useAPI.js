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
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0MDQ3OTQwNCwianRpIjoiMjdmMDYxN2EtMWM3NC00OTM0LTliOTEtNGExNDVhMDQzMzYzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjBlMjI1ZTAzLTliNDYtNGNiNC1hNjUyLWY4NzYzZjA3YzY3NiIsIm5iZiI6MTc0MDQ3OTQwNCwiY3NyZiI6IjE4MmIxNWU3LWE1MjctNDc3NS05MmI2LTQ4ZTA0ZTM0ZGJhYyIsImV4cCI6MTc0MDQ4NjYwNCwiZW1haWwiOiJzdXBlcmFkbWluQGdtYWlsLmNvbSIsInBob25lIjoiKzExMjM0MyIsInVzZXJfdXVpZCI6IjBlMjI1ZTAzLTliNDYtNGNiNC1hNjUyLWY4NzYzZjA3YzY3NiIsInVzZXJfdHlwZSI6ImFkbWluIiwidXNlcl9zZWNyZXQiOiJzY3J5cHQ6MzI3Njg6ODoxJGVSeXMyN1ZnTlVNZm4wRlgkZDE3MzFmZWY3YzUxOGRhNTgzMTNiMGJlNGY5YmViZmIyMGRmMmIzMDhlYTM4Y2IxN2RlOWVhNGZkZTc3NmU5OGJiOTcwYTYzNzFjNjNjYTQ0OTU1Mjk5NDE5ZDlkMzkzNmU1YTZiODFjMzJmYzkzNjJkN2NmMjJlNDE3NjI1MGUifQ.fgVUCFtonyhwav3JpQ5VAriew7X04ifteWtaKGGkAqs';
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
      // console.log("test expire time in",currentTime,tokenExpiry)
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
      // console.log(headers);
      const requestUrl = id ? `${url}?id=${id}` : url;
      // console.log("requestUrl", requestUrl);
      const response = await httpClient.get(requestUrl, { headers });
      setLoading(false);
      return response?.data;
    } catch (error) {
      setError(error);
      setLoading(false);

      if (error.response?.status === 404 || error.response?.status === 401) {
        console.warn('Data not found, returning empty object.');
        return { data: [], code: 404 }; // Prevents UI from breaking
      }
      throw error; // Re-throw other errors
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
      // console.log(headers);
      const requestUrl = url;
      // console.log("requestUrl", requestUrl);
      const response = await httpClient.get(requestUrl, { headers });
      setLoading(false);
     
      return response?.data;
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn('Data not found, returning empty object.');
        return { data: [], code: 404 }; // Prevents UI from breaking
      }
      setError(error);
      setLoading(false);
      throw error; // Re-throw the error for the caller to handle
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
      //console.log(loginUrl)
      const response = await httpClient.post(url, data, { headers });
      setLoading(false);
      if (redirectUrl) {
        navigate(redirectUrl);
      }
      return response.data;
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
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
      //console.log(loginUrl)
      const response = await httpClient.post(url, data, { headers });
      setLoading(false);
      if (redirectUrl) {
        navigate(redirectUrl);
      }
      return response.data;
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
    }
  };
  const postRegisterData = async (url, data, redirectUrl = null) => {
    if (isTokenExpired()) {
      handlogout();
      navigate('/');
      return;
    }
    const headers = {
      Authorization: `${STATIC_JWT_TOKEN}`,
      'ngrok-skip-browser-warning': 1,
      'Content-Type': 'multipart/form-data',
    };
    setLoading(true);
    setError(null);

    try {
      //console.log(loginUrl)
      const response = await httpClient.post(url, data, { headers });
      setLoading(false);
      if (redirectUrl) {
        navigate(redirectUrl);
      }
      return response.data;
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
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
      throw error;
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
      throw error;
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
      throw error;
    }
  };

  // const patchData = async (url, data, redirectUrl = null) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await httpClient.patch(url, data, { headers });
  //     setLoading(false);
  //     if (redirectUrl) {
  //       navigate(redirectUrl);
  //     }
  //     return response.data;
  //   } catch (error) {
  //     setError(error);
  //     setLoading(false);
  //     throw error;
  //   }
  // };

  const deleteData = async (url, redirectUrl = null) => {
    if (isTokenExpired()) {
      handlogout();
      navigate('/');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // console.log("url", url);
      const response = await httpClient.delete(url, { headers });
      setLoading(false);
      if (redirectUrl) {
        navigate(redirectUrl);
      }
      return response?.data;
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
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
    // console.log(data)
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
      throw error;
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
      // console.log("url", url);
      const response = await httpClient.delete(url, {
        headers,
        data: JSON.stringify(payload),
      });
      setLoading(false);
      return response?.data;
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
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
