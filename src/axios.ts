import axios from 'axios';
import { apiUrl } from './appConstants';

const apiClient = axios.create({
    baseURL: apiUrl, 
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const API_KEY = import.meta.env.VITE_API_KEY || 'default-key';

        if (API_KEY) {
            config.headers['Authorization'] = `${API_KEY}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;