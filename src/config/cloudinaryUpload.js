require('dotenv').config()
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const options = {
  overwrite: true,
  invalidate: true,
  folder: 'octa_empire'
}

exports.image = (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, options, (err, result) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

const videoOptions = {
  resource_type: 'raw',
  overwrite: true,
  invalidate: true
}

exports.audio = (video) => {
  // must be base 64
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(video, videoOptions, (err, result) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
