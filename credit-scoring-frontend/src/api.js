// In your api.js (axios instance)
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', // or your backend URL
    withCredentials: true, // This is important for sending cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;