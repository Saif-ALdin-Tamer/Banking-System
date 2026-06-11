import Transaction from "../models/transactionModel.js";
import User from "../models/usersModel.js";
import Notification from "../models/notificationModel.js";

export const transfer = async (req, res) => {
    const { receiveEmail, amount } = req.body;
    try {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ success: false, message: "Invalid transfer amount" });
        }

        const sender = await User.findById(req.user._id);
        if (!sender) {
            return res.status(404).json({ message: "Sender not found" });
        }

        if (sender.balance < Number(amount)) {
            return res.status(400).json({ success: false, message: "You Balance is not enough" });
        }

        const receiver = await User.findOne({ email: receiveEmail });
        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }

        if (sender.email === receiver.email) {
            return res.status(400).json({ success: false, message: "You cannot transfer money to yourself" });
        }

        sender.balance -= Number(amount);
        receiver.balance += Number(amount);

        await sender.save();
        await receiver.save();

        await Transaction.create({
            user: sender._id,
            type: "transfer",
            amount: Number(amount),
            receiver: receiver.email,
        });

        await Notification.create({
            user: receiver._id,
            title: "You have received money",
            message: `You have received an amount of ${amount} EGP from ${sender.name}.`,
        });

        await Notification.create({
            user: sender._id,
            title: "Recived Successfully",
            message: `An amount of ${amount} EGP has been successfully transferred to ${receiver.name}.`,
        });

        return res.status(200).json({
            success: true,
            message: "Transfer completed successfully",
            senderBalance: sender.balance
        });

    } catch (error) {
    if (error.name === "ValidationError") {
        for (let everyError in error.errors) {
            console.log(error.errors[everyError]);
        }
        return res.status(400).send("Request invalid");
    }
    console.error("Error in transfer:", error);
    return res.status(500).send("Internal Server Error");
    }
};
