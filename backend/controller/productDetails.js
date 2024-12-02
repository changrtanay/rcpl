const productModel = require("../models/productModel");

const productDetailsController = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await productModel.findById(productId);

    res.json({
      data: product,
      message: "Product Details",
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err?.message,
      error: true,
      success: false,
    });
  }
};

module.exports = productDetailsController;
