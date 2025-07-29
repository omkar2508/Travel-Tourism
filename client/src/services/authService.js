// D:/client/src/services/authService.js
import axios from 'axios';

const API_URL = '/api/auth';

const signup = (name, email, password, role) => {
  return axios.post(`${API_URL}/signup`, { name, email, password, role });
};

const login = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

const logout = () => {
  return axios.post(`${API_URL}/logout`); // Backend logout might just invalidate token for security
};

const checkLoginStatus = () => {
  return axios.get(`${API_URL}/isLoggedIn`);
};

const authService = {
  signup,
  login,
  logout,
  checkLoginStatus,
};

export default authService;