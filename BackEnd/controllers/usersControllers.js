import User from "../models/usersModel.js"
import Card from "../models/cardModel.js"


export const getUserData = async (req, res) => {
    try{
        const user = await User.findById (req.user._id)
        .select("-password") ;
        if ( !user ) {
            return res.status ( 404).json ({
                success: false ,
                message: "user invaliad" ,
                data: null
            })
        }
        const userSpacifecCard = await Card.findOne({
                user: req.user._id
            }).select("balance cardNumber cvv expiryDate -_id")
            return res.status(200).json({
                success: true ,
                data: userSpacifecCard ,
                ...user.toObject() ,
                card: userSpacifecCard || null
            }) ;
    } catch ( error ) {
        if (error.name === "ValidationError") {
            for (let everyError in error.errors) {
                console.log( error.errors[everyError].message ) ;
            }
            return res.status(400).send("Request invalid") ;
        }
        console.error("Error in getUserData:", error) ;
        return res.status(500).send("Internal Server Error") ;
    }
    
}

export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                data: null,
                message: 'User not found'
            });
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already in use'
                });
            }
            user.email = email;
        }

        if (name) {
            user.name = name;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch ( error ) {
        if (error.name === "ValidationError") {
            for ( let everyError in error.errors) {
                console.log ( error.errors[everyError] )
            } 
            return res.status(400).send("Request invalid")
        } 
        console.error("Error in updateProfile:", error) ;
        return res.status(500).send("Internal Server Error") ;
    }
}