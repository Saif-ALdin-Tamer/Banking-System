import mongoose from "mongoose";
const cardSchema = new mongoose.Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User" ,
        required: true ,
    } ,
    balance: {
    type: Number,
    default: 0, 
    },
    cardNumber: {
        type: String , 
        required: true ,
    } ,
    cvv: {
        type: String ,
        required: true ,
    } ,
    expiryDate: {
        type: String ,
        required: true ,
    } ,
    createdAt: {
        type: String,
        default: () => new Date().toISOString()
    } ,
})
export default mongoose.model('Card', cardSchema)