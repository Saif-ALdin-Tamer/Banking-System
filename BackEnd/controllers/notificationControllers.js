import Notification from "../models/notificationModel.js" ;

export const getNotifications  = async (req, res) => {
    try{
        const notifications = await Notification.find({
            user: req.user._id
        }).sort({
            createdAt: -1
        }) ;
        res.json ({
            data: notifications
        })
    } catch ( error ) {
        if (error.name === "ValidationError") {
            for (let everyError in error.errors) {
                console.log ( error.errors[everyError].message ) ;
            }
            return res.status(400).send("Request invalid") ;
        }
        console.error("Error in getNotifications:", error) ;
        return res.status(500).send("Internal Server Error") ;
    } ;
} ;


export const markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate ( req.params.id, { read: true })
    res.json({
        success: true
    })
    } catch ( error ) {
        if (error.name === "ValidationError") {
            for (let everyError in error.errors) {
                console.log ( error.errors[everyError].message ) ;
            }
            return res.status(400).send("Request invalid") ;
        }
        console.error("Error in markAsRead:", error) ;
        return res.status(500).send("Internal Server Error") ;
    } ;
}