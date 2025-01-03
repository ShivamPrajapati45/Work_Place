import axios from "axios";
const api = axios.create({
    baseURL: 'http://localhost:3001/api/auth',
    withCredentials: true
});

export const googleAuth = (code) => api.get(`/google?code=${code}`);

