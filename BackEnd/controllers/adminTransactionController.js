import Transaction from "../models/transactionModel.js" ;
import User from "../models/usersModel.js" ;

export const getAllTransaction = async (req, res) => {
    try {
        const allTransactions = await Transaction.find()
            .populate('user', 'name email')
            .sort({ date: -1 });
        return res.status(200).json({
            success: true,
            data: allTransactions
        });
    } catch (error) {
        console.error("Error in getAllTransaction:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
} ;