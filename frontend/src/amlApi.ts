// src/amlApi.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/auth';

// Get token from localStorage
const getToken = () => localStorage.getItem('aml_token') || '';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Token ${getToken()}`,
  },
});

// ----- RULES API -----
export const getRules = async () => {
  const response = await axiosInstance.get('/rules/');
  return response.data;
};

export const createRule = async (ruleData: any) => {
  const response = await axiosInstance.post('/rules/', ruleData);
  return response.data;
};

export const updateRule = async (id: string, ruleData: any) => {
  const response = await axiosInstance.put(`/rules/${id}/`, ruleData);
  return response.data;
};

export const deleteRule = async (id: string) => {
  const response = await axiosInstance.delete(`/rules/${id}/`);
  return response.data;
};

// ----- TRANSACTIONS API -----
export const getTransactions = async () => {
  const response = await axiosInstance.get('/transactions/');
  return response.data;
};

export const createTransaction = async (txData: any) => {
  const response = await axiosInstance.post('/transactions/', txData);
  return response.data;
};

export const clearAllTransactions = async () => {
  const response = await axiosInstance.delete('/transactions/');
  return response.data;
};

export const exportAllTransactions = async () => {
  const response = await axiosInstance.get('/export-all-transactions-csv/', {
    responseType: 'blob',
  });
  return response.data; // This will be a Blob
};
