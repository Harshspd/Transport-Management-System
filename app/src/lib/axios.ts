// lib/axios.ts
import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',  // This is the base URL for your API
   
});
// Add auth token dynamically using interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  console.log('Token:', token);
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
axiosInstance.interceptors.response.use(
  (response) => {
    if(response.status == 201){
    const message =
      response?.data?.message ;
    toast.success(message);
    }
    return response
  },
  (error) => {
    console.error('API Error:', error);
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'An unexpected error occurred';

    toast.error(message);
    return Promise.reject(error);
  }
);
export default axiosInstance;
