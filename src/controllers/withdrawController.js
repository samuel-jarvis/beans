const Withdraw = require('../models/withdrawalModel')

exports.createWithdraw = async (req, res) => {
  const { amount, walletAddress, network, withdrawalCode } = req.body

  // if (withdrawalCode !== req.user.withdrawalCode) {
  //   return res.status(400).json({
  //     status: 'error',
  //     message: 'Invalid withdrawal code'
  //   })
  // }

  if (amount < 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid amount'
    })
  }

  if (amount > req.user.account.total_balance) {
    return res.status(400).json({
      status: 'error',
      message: 'Insufficient balance'
    })
  }

  try {
    const newWithdraw = new Withdraw({
      user: req.user._id,
      amount,
      walletAddress,
      network: network || '',
      status: 'pending'
    })

    await newWithdraw.save()

    res.status(201).json({
      status: 'success',
      data: newWithdraw,
      message: 'Withdrawal created successfully'
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
