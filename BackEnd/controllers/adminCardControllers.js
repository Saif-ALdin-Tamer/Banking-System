import Card from "../models/cardModel.js";
import User from "../models/usersModel.js";

export const getAllCards = async (req, res) => {
    try {
        const cards = await Card.find().populate("user", "name email");
        return res.status(200).json(cards);
    } catch (error) {
        console.error("Error in getAllCards:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const deleteCard = async (req, res) => {
    try {
        const deletedCard = await Card.findByIdAndDelete(req.params.id);
        if (!deletedCard) {
            return res.status(404).json({ message: "Card not found" });
        }
        return res.status(200).json({ message: "Card deleted successfully" });
    } catch ( error ) {
        console.error("Error in deleteCard:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};