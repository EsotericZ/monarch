import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.0.1.57:3001/'
    // baseURL: 'http://localhost:3001/'
});

export default api;