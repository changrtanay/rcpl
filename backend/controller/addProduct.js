const addProductPermission = require("../helper/permission");
const productModel = require("../models/productModel")

let addProductController = async function (req, res) {
  try {
    const admin = req.userId
    if(!addProductPermission(admin)) {
        throw new Error("Only Admin can add products")
    }

    const addProduct = new productModel(req.body)
    const saveProduct = await addProduct.save() 

    res.status(200).json({
      message: "Product Added",
      data: saveProduct,
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

module.exports = addProductController;
