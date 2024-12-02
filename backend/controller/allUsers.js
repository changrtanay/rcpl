const userModel = require("../models/userModel")

let allUsersController = async function (req, res) {
    try {
        const allUsers = await userModel.find()
        res.status(200).json({
            message: "User Details",
            data: allUsers,
            error: false,
            success: true,
        })
    } catch(err) {
        res.status(400).json({
            message: err.message,
            error: true, 
            success: false,
        })
    }
}

module.exports = allUsersController