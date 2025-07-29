// D:/client/src/services/placeService.js
import axios from 'axios';

const API_URL = '/api/places';

const getAllPlaces = () => {
  return axios.get(API_URL);
};

const addPlace = (name, price, image_url) => {
  return axios.post(API_URL, { name, price, image_url });
};

const removePlace = (id) => {
  return axios.delete(`${API_URL}/${id}`); // Use DELETE method with ID in URL
};

// NEW FUNCTION: Toggle Place Availability
const togglePlaceAvailability = (id, is_available) => {
  // Use a PATCH request to update a partial resource
  return axios.patch(`${API_URL}/${id}/availability`, { is_available });
};

const placeService = {
  getAllPlaces,
  addPlace,
  removePlace,
  togglePlaceAvailability, // EXPORT THE NEW FUNCTION
};

export default placeService;
