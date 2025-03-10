import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Request interceptor to log outgoing requests
api.interceptors.request.use(request => {
    console.log('Starting Request:', request);
    return request;
  });
  
  // Response interceptor to log incoming responses
  api.interceptors.response.use(response => {
    console.log('Response:', response);
    return response;
  }, error => {
    console.error('Error Response:', error);
    return Promise.reject(error);
  });

export default api;