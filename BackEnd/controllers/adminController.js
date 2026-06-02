import User from "../models/usersModel.js" ;
import Admin from "../models/adminModel.js" ;
import jwt from "jsonwebtoken";


export const generateToken = (id) => {
    return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET || "secret", { expiresIn: "30d" });
};


export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        // @ts-ignore
        const isMatch = await admin.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        return res.status(200).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            token: generateToken(admin._id),
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        const admin = await Admin.create({
            name,
            email,
            password 
        });
        return res.status(201).json({
            success: true,
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            token: generateToken(admin._id)
        });

    } catch (error) {
        console.error("Register Admin Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};