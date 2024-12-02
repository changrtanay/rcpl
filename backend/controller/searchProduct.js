// const productModel = require("../models/productModel");

// const searchProductController = async (req, res) => {
//   try {
//     const query = req.query.q;

//     const regex = new RegExp(query, "i", "g");

//     const product = await productModel.find({
//       $or: [
//         {
//           productName: regex,
//         },
//         {
//           category: regex,
//         },
//         {
//           brand: regex,
//         },
//       ],
//     });

//     res.json({
//       message: "Search Product",
//       data: product,
//       error: false,
//       success: true,
//     });
//   } catch (err) {
//     res.json({
//       message: err.message,
//       error: true,
//       success: false,
//     });
//   }
// };

// module.exports = searchProductController;






const productModel = require("../models/productModel");

const searchProductController = async (req, res) => {
  try {
    const query = req.query.q;
    const category = req.query.category ? req.query.category.split(",") : [];
    const regex = new RegExp(query, "i", "g");

    let searchCriteria = {
      $or: [
        { productName: regex },
        { category: regex },
        { description: regex },
        { color: regex },
        { size: regex },
        // { sellingPrice: parseFloat(searchQuery) || 0 },  // Exact match or range could be applied here
      ],
    };

    if (category.length > 0) {
      searchCriteria.$and = [{ category: { $in: category } }];
    }

    const products = await productModel.find(searchCriteria);

    res.json({
      message: "Search Product",
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

module.exports = searchProductController;




// const productModel = require("../models/productModel");

// // Utility to escape special characters for regex
// const escapeRegex = (str) => {
//   return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
// };

// const searchProductController = async (req, res) => {
//   try {
//     const query = req.query.q || ""; // Ensure query is always a string
//     const category = req.query.category ? req.query.category.split(",") : [];

//     let searchCriteria = {};
    
//     // If the query is a number, handle it separately
//     if (!isNaN(query)) {
//       searchCriteria = {
//         sellingPrice: parseFloat(query),
//       };
//     } else if (query.length > 0) {
//       const regex = new RegExp(escapeRegex(query), "i"); // Escape special characters in regex

//       searchCriteria = {
//         $or: [
//           { productName: regex },
//           { category: regex },
//           { description: regex },
//           { color: regex },
//           { size: regex },
//         ],
//       };
//     }

//     if (category.length > 0) {
//       searchCriteria.$and = [{ category: { $in: category } }];
//     }

//     const products = await productModel.find(searchCriteria);

//     res.json({
//       message: "Search Product",
//       data: products,
//       error: false,
//       success: true,
//     });
//   } catch (err) {
//     res.status(400).json({
//       message: err.message,
//       error: true,
//       success: false,
//     });
//   }
// };

// module.exports = searchProductController;