// D:/server/controllers/placesController.js
const placeModel = require('../models/placeModel');

const getAllPlaces = async (req, res, next) => {
    try {
        // Check if a query parameter for 'availableOnly' is present
        const availableOnly = req.query.availableOnly === 'true';
        let places;
        if (availableOnly) {
            places = await placeModel.getAvailablePlaces(); // New model function
        } else {
            places = await placeModel.getAllPlaces(); // Existing function
        }
        res.status(200).json(places);
    } catch (error) {
        next(error);
    }
};

const addPlace = async (req, res, next) => {
    try {
        const { name, price, image_url } = req.body;
        if (!name || !price || !image_url) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const placeId = await placeModel.addPlace(name, price, image_url);
        res.status(201).json({ message: "Place added successfully!", placeId });
    } catch (error) {
        next(error);
    }
};

const removePlace = async (req, res, next) => {
    try {
        const { place_id } = req.body; // Changed from id to place_id for consistency
        if (!place_id) {
            return res.status(400).json({ message: "Place ID is required." });
        }

        const affectedRows = await placeModel.deletePlace(place_id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: "Place not found." });
        }
        res.status(200).json({ message: "Place removed successfully." });
    } catch (error) {
        next(error);
    }
};




// ... (other controller functions like getAllPlaces, addPlace, removePlace) ...

// NEW: Toggle Place Availability Controller
const togglePlaceAvailability = async (req, res, next) => {
    try {
        const { id } = req.params; // Get place ID from URL parameters
        const { is_available } = req.body; // Get new availability status from body

        console.log(`Attempting to toggle availability for place ID: ${id}`); // DEBUG LOG 1
        console.log(`New availability status requested: ${is_available} (type: ${typeof is_available})`); // DEBUG LOG 2

        if (typeof is_available !== 'boolean') {
            console.log('Validation failed: is_available is not a boolean'); // DEBUG LOG 3
            return res.status(400).json({ message: "Invalid value for is_available. Must be true or false." });
        }

        console.log(`Calling placeModel.updatePlaceAvailability(${id}, ${is_available})`); // DEBUG LOG 4
        const affectedRows = await placeModel.updatePlaceAvailability(id, is_available);
        console.log(`Affected rows from update: ${affectedRows}`); // DEBUG LOG 5

        if (affectedRows === 0) {
            console.log('Place not found for update.'); // DEBUG LOG 6
            return res.status(404).json({ message: "Place not found." });
        }

        res.status(200).json({ message: `Place availability updated to ${is_available ? 'available' : 'frozen'}.` });
    } catch (error) {
        console.error('Error in togglePlaceAvailability controller:', error); // DEBUG LOG 7: CATCH ALL ERRORS
        next(error); // Pass error to global error handler
    }
};


module.exports = { getAllPlaces, addPlace, removePlace, togglePlaceAvailability };
