exports.getUserWallet = async (req, res) => {
  try {
    const wallet = 'wallet'

    res.status(200).json({
      status: 'success',
      data: wallet,
      message: 'Wallets retrieved successfully'
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
