const jwt = require("jsonwebtoken");

let authToken = async function (req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.json({
        message: "You are not logged in. Please Log in First.",
        error: true,
        success: false,
      });
    }

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, function (err, decoded) {
      req.userId = decoded?._id;
      if (err) {
        console.log("error auth ", err);
      }
      next();
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
      data: [],
      error: true,
      success: false,
    });
  }
};

module.exports = authToken;
