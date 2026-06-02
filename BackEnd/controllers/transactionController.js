import Transaction from "../models/transactionModel.js";
import User from "../models/usersModel.js" ;

export const deposite = async function (req, res) {
    const { amount } = req.body ;
    try {
        const user = await User.findById( req.user._id) 
        if (!user) {
    return res.status(404).json({ message: "User not found" });
    }
        user.balance += amount ;
        await user.save () ;

        await Transaction.create ({
            user: user._id ,
            type: "deposit" ,
            amount: amount ,
        }) ;
        return res.status(200).json({
            success: true,
            message: "Deposit successful"
        })
    } catch ( error ) {
        if (error.name === "ValidationError") {
            for (let everyError in error.errors)  {
                console.log (error.errors[everyError].message ) ;
            } ;
            return res.status(404).json({
                message: "Proccess failed or cancelled"
            })
        }
        return res.status(500).json({
            message: "Internal server error"
        })
    }
    
}

export const withdraw = async (req, res) => {
    const { amount } = req.body ;
    try {
        const user = await User.findById(req.user._id) ;
        if (!user) {
    return res.status(404).json({ message: "User not found" });
    }
        if ( user.balance <amount ) {
            return res.status(404).json({
                success: false,
                message: "Your balance Not enough"
            }) ;
        }
            user.balance -= amount ;
            await user.save() ;
            await Transaction.create({
                user: user._id ,
                amount: amount ,
                type: "withdraw"
            }) ;
            res.status(200).json({ message: "Process is done"})
    } catch ( error ) {
        if (error.name === 'ValidationError') {
            for ( let everyError in error.errors) {
                console.log ( error.errors[everyError].message ) ;
            }
            return res.status(404).json({
                message: "Request invalid" 
            }) ;
        }
        return res.status(500).json({
            message: "Internal server error"
        }) ;
    }
}

export const getTransaction = async (req, res) => {
    try {
        const everySingleTransaction = await Transaction.find ({ 
            user:req.user._id,
        }).sort({
            date: -1 }) ;
        res.json({ 
            success: true,
            data: everySingleTransaction
        }) ;
    } catch ( error ) {
        if (error.name === 'ValidationError') {
            for ( let everyError in error.errors) {
                console.log ( error.errors[everyError].message ) ;
            }
            return res.status(404).json({ 
                message: "Request invalid" 
            }) ;
        }
        return res.status(500).json({
            message: "Internal server error"
        }) ;
    }
}