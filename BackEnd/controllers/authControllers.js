import jwt from 'jsonwebtoken';
import User from '../models/usersModel.js';

export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "secret", { expiresIn: "5d" });
};

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExist = await User.findOne({ email }) ;
        if ( userExist ) {
            return res.status(400).json({
                message: "User already exists"
            }) ;
        } ;
        const createUser = await User.create({ 
            name,
            email,
            password,
        }) ;
        if( createUser ) {
            return res.status(201).json({
                _id: createUser._id,
                name: createUser.name,
                email: createUser.email,
                token: generateToken(createUser._id),
            });
        }else {
            return res.status(400).json({ message: "Invalid user data" });
        }
    } catch ( error ) {
        if ( error.name === "ValidationError" ) {
            for ( let singleError in error.errors ) {
                console.log ( error.errors[singleError] ) ;
            }
            return res.status(400).send("Request invalid") ;
        }
        console.error("Error in register:", error);
        return res.status(500).json({ message: "Registration failed. Please try again." });
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body ;
    try {
        const user = await User.findOne({email})
        // @ts-ignore
        if ( user && ( await user.matchPassword( password ) )) {
            return res.json({
            name: user.name ,
            _id: user.id,
            email: user.email,
            token: generateToken( user._id ) ,
            }) ;
        }
        return res.status(401).json({
            message: "Wrong data entered"
        }) ;
    } catch ( error ) {
        if ( error.name === "ValidationError" ) {
            for ( let singleError in error.errors ) {
                console.log ( error.errors[singleError] ) ;
            }
            return res.status(400).send("Request invalid") ;
        }
        console.error("Error in login:", error);
        return res.status(500).json({ message: "Login failed. Please try again." });
    }
}