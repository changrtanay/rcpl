const productModel = require("../models/productModel")

let categoryProductsController = async function (req, res) {
    try {
        const { category } = req?.body || req?.query
        const products = await productModel.find({ category })
        res.status(200).json({
            message: "Product Details",
            data: products,
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

module.exports = categoryProductsController