import Transaction from "../models/transactionModel.js" ;
import User from "../models/usersModel.js" ;

export const getAllTransaction = async (req, res) => {
    const allTransactions = await Transaction.find()
    .populate('user', 'email', 'password')
    .sort({data: -1}) 
} ;