import jwt from "jsonwebtoken";

// User authentication middleware
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized. Login Again",
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // IMPORTANT: Add userId to req.body so it's available in the controller
    if (!req.body) {
      req.body = {};
    }
    req.body.userId = token_decode.id;

    next();
  } catch (error) {
    console.log("Auth error:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export default authUser;