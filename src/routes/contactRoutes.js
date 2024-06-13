const express = require('express')
const router = express.Router()

const {
  getContacts,
  saveContact,
  deleteContact
} = require('../controllers/contactController')

router.get('/', getContacts)

router.post('/', saveContact)

router.delete('/:id', deleteContact)

module.exports = router
