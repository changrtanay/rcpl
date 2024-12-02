const productModel = require("../models/productModel")

let categoryProductOneController = async function (req, res) {
    try {
        const categoryList = await productModel.distinct("category")

        const productList = []

        for(const category of categoryList) {
            const product = await productModel.findOne({category})

            if(product) {
                productList.push(product)
            }
        }
        
        res.status(200).json({
            message: "Category List",
            data: productList,
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

module.exports = categoryProductOneController