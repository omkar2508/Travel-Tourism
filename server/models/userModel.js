    // D:/server/models/userModel.js
    const pool = require('../config/db');
    

    const findUserByEmail = async (email) => {
        const [rows] = await pool.query('SELECT id, name, email, password, role FROM users WHERE email = ?', [email]);
        return rows[0];
    };

    const createUser = async (name, email, hashedPassword, role) => {
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );
        return result.insertId;
    };

    const findUserById = async (id) => {
        const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
        return rows[0];
    };


    const getAllUsers = async () => {
    const [rows] = await pool.query('SELECT id, name, email, role FROM users ORDER BY name ASC');
    return rows;
    };

module.exports = { findUserByEmail, createUser, findUserById, getAllUsers }; // Ensure getAllUsers is exported
