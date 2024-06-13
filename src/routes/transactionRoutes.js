const express = require('express')
const router = express.Router()

const {
  getAllTransactions, getAllUserTransactions,
  addTransaction,
  deleteTransaction,
  getAllTransactionsForUser, requestWithdrawal, getAllUserWithdrawalRequests,
  approveWithdrawalRequest, getAllWithdrawalRequests, deleteWithdrawalRequest
} = require('../controllers/transactionController')

const { isAuth, isAdmin } = require('../middleware/authMiddleware')

router.get('/', isAuth, getAllUserTransactions)

router.post('/withdraw', isAuth, requestWithdrawal)

router.get('/withdraw', isAuth, getAllUserWithdrawalRequests)

// admin endpoints

router.get('/admin', isAuth, isAdmin, getAllTransactions)

router.post('/admin/:id', isAuth, isAdmin, addTransaction)

router.delete('/admin/:id', isAuth, isAdmin, deleteTransaction)

router.get('/admin/:id', isAuth, isAdmin, getAllTransactionsForUser)

router.put('/admin/withdraw/:id', isAuth, isAdmin, approveWithdrawalRequest)

router.get('/admin/withdrawal/requests', isAuth, isAdmin, getAllWithdrawalRequests)

router.delete('/admin/withdrawal/request/:id', isAuth, isAdmin, deleteWithdrawalRequest)

module.exports = router
