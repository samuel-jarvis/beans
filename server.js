require('dotenv').config()
const app = require('./src/app')
const mongoose = require('mongoose')

// socket config
const http = require('http')

// import mongodb config
const config = require('./src/config/dbConfig')

// connect to mongoDB
mongoose
  .connect(config.uri, config.options)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err)
  })

// start server
const port = process.env.PORT || '5000'

// const server = http.Server(app)

app.listen(port, () => {
  console.log('App running on port 5000...')
})
