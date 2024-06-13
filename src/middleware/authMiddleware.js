const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

// verify token
exports.isAuth = async (req, res, next) => {
  const cookieToken = req.cookies.suToken

  const headerToken = req.headers.authorization.split(' ')[1]

  const token = cookieToken || headerToken

  if (!token) return res.status(401).send('Access Denied')

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET)
    req.user = await userModel.findById(verified._id)

    if (!req.user) {
      return res.status(401).send('Invalid Token')
    }

    if (req.user.isBlocked) {
      return res.status(401).send('Your account has been blocked')
    }

    next()
  } catch (err) {
    res.status(401).send('Invalid Token')
  }
}

// check if user is admin
exports.isAdmin = async (req, res, next) => {
  if (req.user.isAdmin) {
    next()
  } else {
    res.status(401).json({ message: 'Not Authorized  Not Admin' })
  }
}
