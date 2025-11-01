import jwt from 'jsonwebtoken'

// Hospital authentication middleware
const authHospital = async (req, res, next) => {
  try {
    // Accept token from Authorization header (Bearer <hToken>) or a custom 'hToken' header
    const authHeader = req.headers.authorization || req.headers.hToken
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Not Authorized, Login again' })
    }

    const hToken = (typeof authHeader === 'string' && authHeader.startsWith('Bearer '))
      ? authHeader.split(' ')[1]
      : authHeader

    const token_decode = jwt.verify(hToken, process.env.JWT_SECRET)

    // Do not mutate req.body (may be undefined). Attach id to req.hospitalId instead.
    req.hospitalId = token_decode.id || token_decode._id || token_decode.hospitalId
    next()
    
  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
}

export default authHospital