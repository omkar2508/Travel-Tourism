// D:/server/models/placeModel.js
const pool = require('../config/db');

const getAllPlaces = async () => {
    const [rows] = await pool.query('SELECT * FROM places ORDER BY name ASC');
    return rows;
};

// NEW: Get only available places
const getAvailablePlaces = async () => {
    const [rows] = await pool.query('SELECT * FROM places WHERE is_available = TRUE ORDER BY name ASC');
    return rows;
};

const addPlace = async (name, price, imageUrl) => {
    // When adding a place, it should be available by default
    const [result] = await pool.query(
        'INSERT INTO places (name, price, image_url, is_available) VALUES (?, ?, ?, TRUE)',
        [name, price, imageUrl]
    );
    return result.insertId;
};

const deletePlace = async (placeId) => {
    const [result] = await pool.query('DELETE FROM places WHERE id = ?', [placeId]);
    return result.affectedRows;
};

const getPlaceById = async (placeId) => {
    const [rows] = await pool.query('SELECT * FROM places WHERE id = ?', [placeId]);
    return rows[0];
};

// NEW: Update place availability
const updatePlaceAvailability = async (id, is_available) => {
    const [result] = await pool.query(
        'UPDATE places SET is_available = ? WHERE id = ?',
        [is_available, id]
    );
    return result.affectedRows;
};

module.exports = {
    getAllPlaces,
    getAvailablePlaces, // Export new function
    addPlace,
    deletePlace,
    getPlaceById,
    updatePlaceAvailability // Export new function
};
