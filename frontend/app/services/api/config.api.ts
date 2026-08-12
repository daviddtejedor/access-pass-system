import axios from 'axios';

// Si process.env no está presente, forzamos el puerto 3000 de Express
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const instance = axios.create({
    baseURL: API,
    withCredentials: true
});

export default instance;