const Transaction = require('../models/transactionModel')
const Withdrawal = require('../models/withdrawalModel')
const User = require('../models/userModel')

// get all transactions belonging to a user
exports.getAllUserTransactions = async (req, res) => {
  try {
    const query = {}
    if (req.query.status) query.status = req.query.status
    if (req.query.transactionType) query.transactionType = req.query.transactionType

    const transactions = await Transaction.find({ user: req.user._id, ...query }).sort({ createdAt: -1 })
    res.status(200).json({
      status: 'success',
      data: transactions,
      message: 'Transactions retrieved successfully'
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}



// place a withdrawal request
exports.requestWithdrawal = async (req, res) => {
  const user = req.user
  const { amount, walletAddress, network } = req.body

  if (!amount || !walletAddress || !network) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  if (amount < 1) {
    return res.status(400).json({ message: 'Amount must be greater than 0' })
  }

  if (amount > user.account?.balance) {
    return res.status(400).json({ message: 'Insufficient balance' })
  }

  try {
    // remove user balance
    user.account.balance -= amount
    await user.save()

    const transaction = await Transaction.create({
      user: user._id,
      amount: -amount,
      description: 'withdrawal request',
      transactionType: 'withdrawal',
      status: 'pending'
    })

    const withdrawal = await Withdrawal.create({
      user: user._id,
      amount,
      walletAddress,
      network,
      transaction: transaction._id
    })

    res.status(201).json({
      status: 'success',
      data: withdrawal,
      message: 'Withdrawal request created successfully'
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// get all user withdrawal requests
exports.getAllUserWithdrawalRequests = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.status(200).json({
      status: 'success',
      data: withdrawals,
      message: 'Withdrawal requests retrieved successfully'
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// admin
// get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const query = {}
    if (req.query.status) query.status = req.query.status
    if (req.query.transactionType) query.transactionType = req.query.transactionType

    const transactions = await Transaction.find(query).sort({ createdAt: -1 })
    res.status(200).json({
      status: 'success',
      data: transactions,
      message: 'Transactions retrieved successfully'
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// admin
// add transaction for user with id
exports.addTransaction = async (req, res) => {
  const userId = req.params.id

  // find user
  const user = await User.findById(userId)
  if (!user) return res.status(404).json({ message: 'User not found' })

  try {
    const transaction = await Transaction.create({
      user: userId,
      amount: req.body.amount,
      description: req.body.description,
      transactionType: req.body.transactionType,
      status: req.body.status,
      // date: req.body.date,
      createdAt: req.body.date
    })

    res.status(201).json({
      status: 'success',
      data: transaction,
      message: 'Transaction created successfully'
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// admin
// delete transaction with id
exports.deleteTransaction = async (req, res) => {
  const transactionId = req.params.id

  try {
    const transaction = await Transaction.findByIdAndDelete(transactionId)
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' })

    res.status(200).json({
      status: 'success',
      data: transaction,
      message: 'Transaction deleted successfully'
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// get all transactions for a user
exports.getAllTransactionsForUser = async (req, res) => {
  const userId = req.params.id

  try {
    const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 })
    res.status(200).json({
      status: 'success',
      data: transactions,
      message: 'Transactions retrieved successfully'
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// get all withdrawal requests
exports.getAllWithdrawalRequests = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find().sort({ createdAt: -1 })
    res.status(200).json({
      status: 'success',
      data: withdrawals,
      message: 'Withdrawal requests retrieved successfully'
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// admin approve withdrawal request and create transaction
exports.approveWithdrawalRequest = async (req, res) => {
  const withdrawalId = req.params.id

  try {
    const withdrawal = await Withdrawal.findById(withdrawalId)
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal request not found' })

    // update withdrawal status
    withdrawal.status = 'approved'
    await withdrawal.save()

    // update status of transaction
    const transaction = await Transaction.findById(withdrawal.transaction)
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' })

    transaction.status = 'completed'
    await transaction.save()

    res.status(200).json({
      status: 'success',
      data: withdrawal,
      message: 'Withdrawal request approved successfully'
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// delete withdrawal request
exports.deleteWithdrawalRequest = async (req, res) => {
  const withdrawalId = req.params.id

  try {
    const withdrawal = await Withdrawal.findByIdAndDelete(withdrawalId)
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal request not found' })

    res.status(200).json({
      status: 'success',
      data: withdrawal,
      message: 'Withdrawal request deleted successfully'
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
