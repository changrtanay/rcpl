const productModel = require("../models/productModel")

let allProductsController = async function (req, res) {
    try {
        const allProducts = await productModel.find()
        res.status(200).json({
            message: "Product Details",
            data: allProducts,
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

module.exports = allProductsController