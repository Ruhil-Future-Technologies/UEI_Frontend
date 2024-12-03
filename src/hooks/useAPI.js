import { useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { httpClient } from "../utils/http-client";

const useApi = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `${token}`,
  };
  const tokenExpiry = localStorage.getItem('tokenExpiry');
const isTokenExpired = () => {
if (token && tokenExpiry) {
  const currentTime = Date.now();
  // console.log("test expire time in",currentTime,tokenExpiry)
  if (currentTime > parseInt(tokenExpiry)) {
    return true
  }
  else{
    return false
  }
} else {
  return false
}
};
  const getData = async (url, id) => {
    if (isTokenExpired()) {
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
      throw error; // Re-throw the error for the caller to handle
    }
  };

  const postData = async (url, data, redirectUrl = null) => {
    if (isTokenExpired()) {
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

  const putData = async (url, data, redirectUrl = null) => {
    if (isTokenExpired()) {
      navigate('/'); 
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const requestUrl = url;
      // const response = await axios.put(requestUrl, data,{ headers });
      const response = await httpClient.put(requestUrl, JSON.stringify(data), {
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
      navigate('/'); 
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // console.log("url", url);
      const response = await httpClient.delete(url, { headers,data: JSON.stringify(payload) });
      setLoading(false);
      return response?.data;
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  return { getData, postData, putData, deleteData, postFileData, deleteFileData, loading, error };
};

export default useApi;
