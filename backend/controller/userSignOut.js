let userSignOutController = async function (req, res) {
  try {
    const tokenOption = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };
    res.clearCookie("token", tokenOption);
    res.json({
      message: "User Signed Out",
      error: false,
      success: true,
      data: [],
    });
  } catch (err) {
    res.json({
      message: err.message,
      error: true,
      success: false,
    });
  }
};

module.exports = userSignOutController;
