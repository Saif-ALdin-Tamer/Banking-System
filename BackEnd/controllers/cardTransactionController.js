import Card from "../models/cardModel.js" ;
import User from "../models/usersModel.js" ;
import Transaction  from "../models/transactionModel.js" ;
import Notification from "../models/notificationModel.js" ;


export const depositToCard = async (req, res) => {
    const { amount } = req.body;

    try {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid deposit amount" 
            });
        }
        const card = await Card.findOne({ user: req.user._id });
        
        if (!card) {
            return res.status(404).json({ message: "Card not found for this user" });
        }
        card.balance += Number(amount);
        await card.save();
        await Transaction.create({
            user: req.user._id,
            type: "deposit-card",
            amount: Number(amount),
            receiver: card.cardNumber,
        });
        await Notification.create({
            user: req.user._id,
            title: "Deposit Successful",
            message: `An amount of ${amount} has been successfully deposited to your card.`,
        });
        return res.status(200).json({
            success: true,
            message: "Deposit completed successfully",
            newBalance: card.balance 
        });
    }catch ( error ) {
        if (error.name === 'ValidationError') {
            for ( let everyError in error.errors) {
                console.log ( error.errors[everyError].message ) ;
            }
            return res.status(400).json({
                message: "Validation failed" 
            }) ;
        }
        console.error("Error in depositToCard:", error);
        return res.status(500).json({
            message: "Internal server error"
        }) ;
    }
};

export const withdrawFromCard = async (req, res) => {
    const { amount } = req.body;
    try {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid withdrawal amount"
            });
        }
        const card = await Card.findOne({ user: req.user._id });
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }
        if (card.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }
        card.balance -= Number(amount);
        await card.save();
        await Transaction.create({
            user: req.user._id,
            type: "withdraw-to-card",
            amount: Number(amount),
            receiver: card.cardNumber,
        });
        await Notification.create({
            user: req.user._id,
            title: "Withdrawal Successful",
            message: `An amount of ${amount} has been successfully withdrawn from your card.`,
        });
        return res.status(200).json({
            success: true,
            message: "Withdrawal completed successfully",
            newBalance: card.balance
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};


export const getCardBalance = async (req, res) => {
    try {
        const card = await Card.findOne({ user: req.user._id });
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }
        res.json({ balance: card.balance, cardNumber: card.cardNumber });
    }catch ( error ) {
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

export const transferToCard = async (req, res) => {
    const { amount } = req.body;
    try {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ success: false, message: "Invalid transfer amount" });
        }
        
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const card = await Card.findOne({ user: req.user._id });
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }
        
        if (user.balance < Number(amount)) {
            return res.status(400).json({ message: "Insufficient user balance" });
        }
        
        user.balance -= Number(amount);
        card.balance += Number(amount);
        
        await user.save();
        await card.save();
        
        await Transaction.create({
            user: req.user._id,
            type: "transfer-to-card",
            amount: Number(amount),
            receiver: card.cardNumber,
        });
        
        await Notification.create({
            user: req.user._id,
            title: "Transfer Successful",
            message: `Successfully transferred ${amount} to your card.`,
        });
        
        return res.status(200).json({
            success: true,
            message: "Transfer to card completed successfully",
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Request invalid" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const transferToAccount = async (req, res) => {
    const { amount } = req.body;
    try {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ success: false, message: "Invalid transfer amount" });
        }

        const user = await User.findById(req.user._id); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const card = await Card.findOne({ user: req.user._id }); 
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        } 

        if (card.balance < Number(amount)) {
            return res.status(400).json({ message: "Your Card Balance is Not Enough" });
        }

        card.balance -= Number(amount);
        user.balance += Number(amount);

        await card.save(); 
        await user.save();

        await Transaction.create({
            user: user._id,
            type: "transfer-to-account",
            amount: Number(amount),
            receiver: user.email
        });
        await Notification.create({
            user: req.user._id,
            title: "Internal transfer",
            message: `Successfully transferred ${amount} from your card to your account.`, 
        });
        return res.status(200).json({
            success: true,
            message: "Transfer to account completed successfully",
            userBalance: user.balance,
            cardBalance: card.balance, 
        }); 
    }catch ( error ) {
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