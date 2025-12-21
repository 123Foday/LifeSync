import jwt from 'jsonwebtoken'

// Doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    // Accept token from Authorization header (Bearer <dToken>) or a custom 'dToken' header
    const authHeader = req.headers.authorization || req.headers.dToken
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Not Authorized, Login again' })
    }

    const dToken = (typeof authHeader === 'string' && authHeader.startsWith('Bearer '))
      ? authHeader.split(' ')[1]
      : authHeader

    const token_decode = jwt.verify(dToken, process.env.JWT_SECRET)

    // Do not mutate req.body (may be undefined). Attach id to req.userId instead.
    req.docId = token_decode.id || token_decode._id || token_decode.docId
    next()
    
  } catch (error) {
    console.error("AuthDoctor error:", error);
    res.status(401).json({ success: false, message: error.message || "Token invalid or expired" });
  }
}

export default authDoctor