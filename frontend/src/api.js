import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
});

export const getExpenses = async () => {
  const response = await api.get('/expenses/');
  return response.data;
};

export const createExpense = async (expenseData) => {
  const response = await api.post('/expenses/', expenseData);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};

export const getPrediction = async () => {
  const response = await api.get('/predict/');
  return response.data;
};
