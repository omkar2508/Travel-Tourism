// D:/server/utils/jwtUtils.js
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' }); // Adjust path

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null; // Token invalid or expired
    }
};

module.exports = { generateToken, verifyToken };