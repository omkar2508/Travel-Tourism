    // D:/server/middleware/authMiddleware.js
    const { verifyToken } = require('../utils/jwtUtils');

    const isAuthenticated = (req, res, next) => {
        // Get token from header (usually 'Bearer <token>')
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'Unauthorized: No token provided.' });
        }

        const token = authHeader.split(' ')[1]; // Extract the token
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Token format invalid.' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(403).json({ message: 'Forbidden: Invalid or expired token.' });
        }

        req.user = decoded; // Attach user payload (id, email, role) to request
        next();
    };

    const isAdmin = (req, res, next) => {
        // isAuthenticated must run before isAdmin to populate req.user
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
        }

        if (req.user.role === 'admin') { // This check now relies on the 'role' from the DB via JWT
            next();
        } else {
            res.status(403).json({ message: 'Access denied: Admins only.' });
        }
    };

    module.exports = { isAuthenticated, isAdmin };
    