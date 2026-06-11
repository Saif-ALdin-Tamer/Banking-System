import Card from "../models/cardModel.js" ;
import User from "../models/usersModel.js" ;

function generateCardNumber() {
    const prefix = "4000";
    const randomPart = Math.floor(Math.random() * 1e12).toString().padStart(12, "0");
    return prefix + randomPart;
}

function generateCVV() {
    return Math.floor(100 + Math.random() * 900).toString();
}

function generateExpiry() {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = (date.getFullYear() + 3).toString().slice(2);
    return `${month}/${year}`;
}

export const createCard = async (req, res) => {
    try {
        const existing = await Card.findOne({ user: req.user._id });
        if (existing) {
            return res.status(400).json({ message: "Card already exists for this user" });
        }
        const card = await Card.create({
            user: req.user._id,
            cardNumber: generateCardNumber(),
            cvv: generateCVV(),
            expiryDate: generateExpiry(),
        });
        res.json(card);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};


export const getMyCard = async (req, res) => {
    try {
        const card = await Card.findOne({ user: req.user._id });
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }
        res.json(card);
    } catch (error) {
    if (error.name === "ValidationError") {
        for (let everyError in error.errors) {
            console.log(error.errors[everyError]);
        }
        return res.status(400).send("Request invalid");
    }
    console.error("Error in getMyCard:", error);
    return res.status(500).send("Internal Server Error");
    }
};
