import Transaction from "../models/transactionModel.js";
import User from "../models/usersModel.js" ;

export const deposite = async function (req, res) {
    const { amount } = req.body ;
    try {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid deposit amount"
            });
        }
        const user = await User.findById( req.user._id)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.balance += Number(amount) ;
        await user.save () ;

        await Transaction.create ({
            user: user._id ,
            type: "deposit" ,
            amount: Number(amount) ,
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
            return res.status(400).json({
                message: "Process failed or cancelled"
            })
        }
        console.error("Error in deposite:", error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
    
}

export const withdraw = async (req, res) => {
    const { amount } = req.body ;
    try {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid withdrawal amount"
            });
        }
        const user = await User.findById(req.user._id) ;
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if ( user.balance < Number(amount) ) {
            return res.status(400).json({
                success: false,
                message: "Your balance is not enough"
            }) ;
        }
            user.balance -= Number(amount) ;
            await user.save() ;
            await Transaction.create({
                user: user._id ,
                amount: Number(amount) ,
                type: "withdraw"
            }) ;
            res.status(200).json({ message: "Process is done"})
    } catch ( error ) {
        if (error.name === 'ValidationError') {
            for ( let everyError in error.errors) {
                console.log ( error.errors[everyError].message ) ;
            }
            return res.status(400).json({
                message: "Request invalid" 
            }) ;
        }
        console.error("Error in withdraw:", error);
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
            return res.status(400).json({ 
                message: "Request invalid" 
            }) ;
        }
        console.error("Error in getTransaction:", error);
        return res.status(500).json({
            message: "Internal server error"
        }) ;
    }
}