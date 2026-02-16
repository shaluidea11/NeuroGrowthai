/**
 * NeuroGrowth AI - API Client Service
 */

import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ─── Auth ────────────────────────────────────────────────────
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),
    getMe: () => api.get('/auth/me'),
};

// ─── Daily Logs ──────────────────────────────────────────────
export const logsAPI = {
    create: (data) => api.post('/log-daily', data),
    getByStudent: (studentId, limit = 30) => api.get(`/logs/${studentId}?limit=${limit}`),
};

// ─── Predictions ─────────────────────────────────────────────
export const predictionAPI = {
    predict: (studentId) => api.get(`/predict/${studentId}`),
    simulate: (data) => api.post('/simulate', data),
};

// ─── Roadmap ─────────────────────────────────────────────────
export const roadmapAPI = {
    generate: (data) => api.post('/generate-roadmap', data),
    get: (studentId) => api.get(`/roadmap/${studentId}`),
};

// ─── Assistant ───────────────────────────────────────────────
export const assistantAPI = {
    chat: (data) => api.post('/chat-assistant', data),
};

// ─── Dashboard ───────────────────────────────────────────────
export const dashboardAPI = {
    get: (studentId) => api.get(`/dashboard/${studentId}`),
};

// ─── Admin ───────────────────────────────────────────────────
export const adminAPI = {
    getStudents: () => api.get('/admin/students'),
    getClustering: () => api.get('/admin/clustering'),
    getRiskHeatmap: () => api.get('/admin/risk-heatmap'),
    getPerformanceDistribution: () => api.get('/admin/performance-distribution'),
    retrain: () => api.post('/admin/retrain'),
};

export default api;
