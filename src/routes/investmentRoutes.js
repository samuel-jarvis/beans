const express = require('express')
const router = express.Router()

const { isAuth } = require('../middleware/authMiddleware')

const {
  getInvestments,
  // getInvestment,
  createInvestment,
  // updateInvestment,
  deleteInvestment
} = require('../controllers/investmentController')

router.post('/', isAuth, createInvestment)

// router.get('/:id', isAuth, getInvestment)

// router.put('/:id', isAuth, updateInvestment)

router.delete('/:id', isAuth, deleteInvestment)

router.get('/', isAuth, getInvestments)

module.exports = router
