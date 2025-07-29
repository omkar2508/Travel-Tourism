// D:/client/src/services/bookingService.js
import axios from 'axios';

const API_URL = '/api/bookings';

const bookPlace = (place_id) => {
  return axios.post(API_URL, { place_id });
};

const getUserBookings = () => {
  // User ID is sent via JWT in the auth header, no need to pass in query
  return axios.get(`${API_URL}/user`);
};

const getAllBookings = () => {
  // Admin API, token handled by axios interceptor
  return axios.get(`${API_URL}/admin`);
};

const bookingService = {
  bookPlace,
  getUserBookings,
  getAllBookings,
};

export default bookingService;