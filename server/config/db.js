// D:/server/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' }); // Adjust path as needed for your .env location

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;