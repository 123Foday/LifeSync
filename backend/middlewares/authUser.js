import jwt from 'jsonwebtoken'

// User authentication middleware
const authUser = async (req, res, next) => {
  try {
    // Accept token from Authorization header (Bearer <token>) or a custom 'token' header
    const authHeader = req.headers.authorization || req.headers.token
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Not Authorized, Login again' })
    }

    const token = (typeof authHeader === 'string' && authHeader.startsWith('Bearer '))
      ? authHeader.split(' ')[1]
      : authHeader

    const token_decode = jwt.verify(token, process.env.JWT_SECRET)

    // Do not mutate req.body (may be undefined). Attach id to req.userId instead.
    req.userId = token_decode.id || token_decode._id || token_decode.userId
    next()
  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
}

export default authUser