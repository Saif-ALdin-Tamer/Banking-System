import Stripe from "stripe";
import User from "../models/usersModel.js";
import Notification from "../models/notificationModel.js";
import Transaction from "../models/transactionModel.js";
import dotenv from "dotenv";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const createDepositSession = async (req, res) => {
    const { amount } = req.body;
    const frontend_url = "http://localhost:5173";
    try {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
        {
            price_data: {
            currency: "usd",
            product_data: {
                name: "Account Deposit",
            },
            unit_amount: amount * 100,
            },
            quantity: 1,
        },
        ],
        mode: "payment",
        success_url: `${frontend_url}/verify-deposit?success=true&amount=${amount}`,
        cancel_url: `${frontend_url}/verify-deposit?success=false`,
    });
    res.json({ success: true, session_url: session.url });
    } catch (error) {
    console.error("Error creating stripe session:", error);
    res.status(500).json({ message: "Internal server error" });
    }
};

export const verifyDeposit = async (req, res) => {
    const { success, amount } = req.body;
    const userId = req.user.id;

    try {
    if (success === "true") {
        const depositAmount = Number(amount);

        const existingTransaction = await Transaction.findOne({
        user: userId,
        type: "deposit",
        amount: depositAmount,
        });
        if (existingTransaction) {
        return res.json({
            success: true,
            message: "Transaction already recorded ",
        });
        }
        const user = await User.findById(userId);
        if (!user) {
    return res.status(404).json({ message: "User not found" });
    }
        user.balance = (user.balance || 0) + depositAmount;
        await user?.save();
        await Transaction.create({
        user: userId,
        type: "deposit",
        amount: depositAmount,
        });
        return res.json({
        success: true,
        message: "Deposit successful ",
        });
    } else {
        return res.status(400).json({
        success: false,
        message: "Payment failed or cancelled",
        });
    }
    } catch (error) {
    console.error("Error in verifyDeposit:", error);
    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
    }
};
