require('dotenv').config()

const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const { errorHandler } = require('./middleware/errorHandler')

// import cors config
const corsConfig = require('./config/corsConfig')

// middleware
app.use(cookieParser())
app.use(helmet())
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send("Welcome to FIdelity API You don't have access 😛")
})

// logger to see what routes are being hit
const myLogger = function (req, res, next) {
  console.log('route ' + req.method, req.url)
  // format time
  console.log('time', new Date().toLocaleTimeString())
  next()
}
app.use(myLogger)

app.use(express.json({ limit: 2000000 }))
app.use(express.urlencoded({ limit: 2000000, extended: false }))
app.use(express.json())

app.set('trust proxy', 1)

app.use(cors(corsConfig))

// link to static files
app.use('/uploads', express.static('uploads'))

// all routes
const routes = require('./routes/index')
app.use('/api', routes)

// export app
module.exports = app

app.use(errorHandler)
