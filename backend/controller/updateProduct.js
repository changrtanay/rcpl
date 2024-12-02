const updateProductPermission = require("../helper/permission");
const productModel = require("../models/productModel")

let updateProductController = async function (req, res) {
  try {
    const admin = req.userId
    if(!updateProductPermission(admin)) {
        throw new Error("Only Admin can update products")
    }

    const { _id, ...body} = req.body

    const updateProduct = await productModel.findByIdAndUpdate(_id, body)

    res.status(200).json({
      message: "Product Updated",
      data: updateProduct,
      error: false,
      success: true,
    });

  } catch (err) {
    res.status(400).json({
      message: err.message,
      error: true,
      success: false,
    });
  }
};

module.exports = updateProductController;
