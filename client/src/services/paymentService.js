// D:/client/src/services/paymentService.js
import axios from 'axios';

const API_URL = '/api/payment';

const createOrder = (amount) => {
  return axios.post(`${API_URL}/createOrder`, { amount });
};

const paymentService = {
  createOrder,
};

export default paymentService;