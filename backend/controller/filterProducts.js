const productModel = require("../models/productModel");

const filterProductsController = async (req, res) => {
  try {
    const category = req?.body?.category || [];

    const products = await productModel.find({
      category: {
        $in: category,
      },
    });
    
    res.json({
      message: "Filter Products",
      data: products,
      error: false,
      success: true,
    });
  } catch (err) {
    res.json({
      message: err.message,
      error: true,
      success: false,
    });
  }
};

module.exports = filterProductsController;
