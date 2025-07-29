// D:/client/src/services/userService.js
import axios from 'axios';

const API_URL = '/api/admin/users'; // Admin-specific endpoint

const getAllUsers = () => {
  return axios.get(API_URL);
};

const userService = {
  getAllUsers,
};

export default userService;
