    // D:/server/controllers/authController.js
    const userModel = require('../models/userModel');
    const { hashPassword, comparePassword } = require('../utils/passwordUtils');
    const { generateToken } = require('../utils/jwtUtils');
    require('dotenv').config({ path: '../.env' });

    const signup = async (req, res, next) => {
        try {
            const { name, email, password, role } = req.body;
            console.log('Signup attempt:', { name, email, role }); // LOG 1

            if (!name || !email || !password || !role) {
                console.log('Signup: Missing required fields'); // LOG 2
                return res.status(400).json({ message: 'All fields are required.' });
            }

            const existingUser = await userModel.findUserByEmail(email);
            if (existingUser) {
                console.log('Signup: Email already registered'); // LOG 3
                return res.status(409).json({ message: 'Email already registered.' });
            }

            console.log('Signup: Hashing password...'); // LOG 4
            const hashedPassword = await hashPassword(password);
            console.log('Signup: Password hashed. Creating user...'); // LOG 5
            const userId = await userModel.createUser(name, email, hashedPassword, role);
            console.log('Signup: User created with ID:', userId); // LOG 6

            res.status(201).json({ message: 'User registered successfully!', userId });
        } catch (error) {
            console.error('Signup Controller Error:', error); // LOG 7: CATCH ALL ERRORS
            next(error);
        }
    };

    const login = async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required.' });
            }

            // Special handling for hardcoded admin login for initial setup (REMOVE IN PRODUCTION)
            if (email === process.env.ADMIN_EMAIL && password === "123456") {
                let adminUser = await userModel.findUserByEmail(process.env.ADMIN_EMAIL);
                if (!adminUser) {
                    // Create admin if not exists (for convenience during development)
                    const hashedPassword = await hashPassword("123456"); // Hash hardcoded password
                    await userModel.createUser("Admin User", process.env.ADMIN_EMAIL, hashedPassword, "admin");
                    adminUser = await userModel.findUserByEmail(process.env.ADMIN_EMAIL); // Fetch the newly created admin
                }
                // Generate token with admin role
                const adminToken = generateToken({ id: adminUser.id, name: adminUser.name, email: adminUser.email, role: adminUser.role });
                return res.json({ message: "Admin login successful", token: adminToken, user: { id: adminUser.id, name: adminUser.name, email: adminUser.email, role: adminUser.role } });
            }
            // End special hardcoded admin login

            const user = await userModel.findUserByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            const isMatch = await comparePassword(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            // Generate token, including the user's role
            const token = generateToken({ id: user.id, name: user.name, email: user.email, role: user.role });

            res.status(200).json({
                message: 'Login successful!',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role // Include role in the response
                }
            });
        } catch (error) {
            next(error);
        }
    };

    const logout = (req, res) => {
        // With JWTs, logout is typically handled client-side by deleting the token.
        // On the server, we might blacklist tokens or simply acknowledge.
        res.status(200).json({ message: 'Logged out successfully.' });
    };

    const checkLoginStatus = async (req, res, next) => {
        try {
            // isAuthenticated middleware already verified the token and attached user to req.user
            if (req.user) {
                // req.user already contains id, email, role from JWT payload
                // If you need more details like 'name', you can fetch from DB
                const userDetails = await userModel.findUserById(req.user.id);
                if (userDetails) {
                     return res.status(200).json({
                        loggedIn: true,
                        user: {
                            id: userDetails.id,
                            name: userDetails.name,
                            email: userDetails.email,
                            role: userDetails.role // Ensure role is returned
                        }
                    });
                }
            }
            res.status(200).json({ loggedIn: false, user: null });
        } catch (error) {
            next(error);
        }
    };

    module.exports = { signup, login, logout, checkLoginStatus };
    