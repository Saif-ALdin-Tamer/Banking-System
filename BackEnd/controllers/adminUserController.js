import User from "../models/usersModel.js" ;

export const getAllUsers = async (req, res) => {
    const users = await User.find().select("-password")
    .sort({name: 1 }) ;
    res.json( users )
}

export const deleteUsers = async (req, res) => {
    const deleteSingleUser = await User.findByIdAndDelete(req.params.id)
    res.json(deleteSingleUser) ;

}

export const updateUserBalance = async (req, res) => {
    const { id } = req.params ;
    const { balance } = req.body ;
    const user = await User.findById(req.params.id) ;
    if ( !user ) {
        console.log("Your Not Find") ;
        return res.status(404).json({
            message: "User Not Found"
        }) ;
    }
    // @ts-ignore
    user.balance = balance ;
    await user.save() ;
    return res.status(200).json({
        message: "User Updated Successfully"
    }) ;
}