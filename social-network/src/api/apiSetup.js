import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
import { supabase } from '../supabase/config';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        } else {
            delete config.headers.Authorization;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

export {api}