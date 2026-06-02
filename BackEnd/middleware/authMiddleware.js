import jwt from 'jsonwebtoken';
import User from '../models/usersModel.js';

export const protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            /** @type {any} */
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
            req.user = await User.findById(decoded.id).select('-password');
            return next();
        } catch (error) {
            console.error("Token verification failed:", error.message);
            return res.status(401).json({ 
                success: false, 
                message: "Not authorized, token failed" 
            });
        }
    }

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Not authorized, no token provided" 
        });
    }
};