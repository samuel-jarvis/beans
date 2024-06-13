const User = require('../models/userModel')
const mongoose = require('mongoose')

const sendNotification = require('../service/notificationService')

// get user Profile by username
exports.getUserByUsername = async (req, res) => {
  const { username } = req.params

  try {
    const user = await User.findOne({ username })

    const { password, completedOnboarding, bookmarkedTopics, ...otherDetails } = user._doc

    if (user.followers.includes(req?.user?._id)) {
      otherDetails.isFollowing = true
    } else {
      otherDetails.isFollowing = false
    }

    res.status(200).json({
      message: 'User Profile Found',
      data: { ...otherDetails, followersCount: user.followersCount }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

// desc Get a user by id
// route GET /api/users/:id
// access Public
exports.getUserById = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) { return res.status(404).send('No user with that id') }

  try {
    const user = await User.findById(req.params.id)
    const { password, ...otherDetails } = user._doc

    res.status(200).json({
      message: 'User Profile Found',
      data: { otherDetails, followersCount: user.followersCount }
    })
  } catch (error) {
    res.status(500).json(error)
  }
}

// search name and username for smilar matches
exports.searchUsers = async (req, res) => {
  // const { query } = req.body;
  const { query } = req.params
  console.log(query)

  try {
    const user = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { 'creatorProfile.creatorTag': { $regex: query, $options: 'i' } }
      ]
    })
    console.log(user)
    res.status(200).json({
      message: 'User Search Successful',
      data: user
    })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}


