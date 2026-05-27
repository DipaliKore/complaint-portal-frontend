import axios from 'axios';

const API_URL = 'https://complaint-portal-backend-production-5195.up.railway.app/api';

const getToken = () => localStorage.getItem('token');

const authHeader = () => ({
    headers: { Authorization: `Bearer ${getToken()}` }
});

// Auth APIs
export const register = (data) => axios.post(`${API_URL}/auth/register`, data);
export const login = (data) => axios.post(`${API_URL}/auth/login`, data);

// Complaint APIs
export const submitComplaint = (data) => axios.post(`${API_URL}/complaints/submit`, data, authHeader());
export const getMyComplaints = () => axios.get(`${API_URL}/complaints/my`, authHeader());
export const getAllComplaints = () => axios.get(`${API_URL}/complaints/all`, authHeader());
export const updateStatus = (id, status) => axios.put(`${API_URL}/complaints/status/${id}?status=${status}`, {}, authHeader());