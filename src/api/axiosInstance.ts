// src/api/axiosInstance.ts
import axios from 'axios';

const API_BASE_URL = "http://43.203.218.183:8080/api/data";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1OSIsInR5cGUiOiJSRUZSRVNIIiwiYXV0aCI6IlJPTEVfVVNFUiIsImlhdCI6MTc1MjgxMDc5MSwiZXhwIjoxNzUzNDE1NTkxfQ.it4glL5HY8JwbpM4h8m0-Z68tUYqwVTiudjKKyJGtXfv-af9mTGR_ReH9zIP6g289dJiNdNRNCHW0al61yC0XQ"; 
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;