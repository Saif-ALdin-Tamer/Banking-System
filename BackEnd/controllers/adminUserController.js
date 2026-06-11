import User from "../models/usersModel.js" ;

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password")
            .sort({ name: 1 });
        res.json(users);
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteUsers = async (req, res) => {
    try {
        const deleteSingleUser = await User.findByIdAndDelete(req.params.id);
        if (!deleteSingleUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error in deleteUsers:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const updateUserBalance = async (req, res) => {
    try {
        const { balance } = req.body;
        if (balance === undefined || balance === null || isNaN(balance) || Number(balance) < 0) {
            return res.status(400).json({ message: "Invalid balance value" });
        }
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        // @ts-ignore
        user.balance = Number(balance);
        await user.save();
        return res.status(200).json({
            message: "User Updated Successfully"
        });
    } catch (error) {
        console.error("Error in updateUserBalance:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}