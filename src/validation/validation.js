// create register validation
const Joi = require('joi')

const registerValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    country: Joi.string().required()
  })
  return schema.validate(data)
}
// create login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  })
  return schema.validate(data)
}

// create update profile validation
const updateProfileValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().min(6).required().email(),
    bio: Joi.string().required(),
    country: Joi.string().required(),
    masterProfile: Joi.object().allow(null)
  })
  return schema.validate(data)
}

// appointment validation
const appointmentValidation = (data) => {
  const schema = Joi.object({
    dateTime: Joi.string(),
    date: Joi.string().required(),
    time: Joi.string().required(),
    message: Joi.string().required(),
    status: Joi.string().required(),
    duration: Joi.string().required(),
    amount: Joi.number().required(),
    master: Joi.string().required()
  })
  return schema.validate(data)
}

// createTransaction validation
const createTransactionValidation = (data) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    amount: Joi.number().required(),
    description: Joi.string().required(),
    reference: Joi.string().required(),
    flow: Joi.string().required(),
    sessionId: Joi.string().required()
  })
  return schema.validate(data)
}

// export
module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.updateProfileValidation = updateProfileValidation
module.exports.appointmentValidation = appointmentValidation
module.exports.createTransactionValidation = createTransactionValidation
