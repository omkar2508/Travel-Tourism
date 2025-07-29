// D:/server/utils/passwordUtils.js
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for hashing

const hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };