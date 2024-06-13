const Contact = require('../models/contactModel')

const {
  successResponse,
  errorResponse
} = require('../utility/response')

// get all contacts
// @ route : GET /api/contacts

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({
      createdAt: -1
    })
    return successResponse(res, contacts)
  } catch (error) {
    return errorResponse(res, error.message)
  }
}

// save contact message
// @ route : POST /api/contacts

exports.saveContact = async (req, res) => {
  try {
    const {
      name,
      email,
      message
    } = req.body

    if (!name || !email || !message) {
      return errorResponse(res, 'All fields are required')
    }

    const contact = new Contact({
      name,
      email,
      message
    })

    await contact.save()

    return successResponse(res, contact)
  } catch (error) {
    return errorResponse(res, error.message)
  }
}

// delete contact message
// @ route : DELETE /api/contacts/:id

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
      return errorResponse(res, 'Contact not found')
    }

    await contact.remove()

    return successResponse(res, contact)
  } catch (error) {
    return errorResponse(res, error.message)
  }
}
