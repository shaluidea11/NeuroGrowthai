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
    login: ({ email, password }) => {
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);
        return api.post('/auth/login', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
    },
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

// ─── Attach convenience methods to default api instance ──────
// This allows pages to do: import api from '../services/api';
// and call api.getMe(), api.login(), api.getDashboard(), etc.
api.login = authAPI.login;
api.register = authAPI.register;
api.getMe = authAPI.getMe;

api.createLog = logsAPI.create;
api.getLogsByStudent = logsAPI.getByStudent;

api.predict = predictionAPI.predict;
api.simulate = predictionAPI.simulate;

api.generateRoadmap = roadmapAPI.generate;
api.getRoadmap = roadmapAPI.get;

api.chatAssistant = assistantAPI.chat;

api.getDashboard = dashboardAPI.get;

api.getStudents = adminAPI.getStudents;
api.getClusters = adminAPI.getClustering;
api.getClustering = adminAPI.getClustering;
api.getRiskHeatmap = adminAPI.getRiskHeatmap;
api.getPerformanceDistribution = adminAPI.getPerformanceDistribution;
api.retrain = adminAPI.retrain;

export default api;
