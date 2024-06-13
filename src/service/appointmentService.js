const Appointments = require('../models/appointmentModel')

// function to create appointment
// accept body user

exports.createAppointment = async (user, body, paymentMethod) => {
  try {
    const appointment = await Appointments.create({
      ...body,
      user: user.id,
      status: 'pending',
      medium: 'medium',
      paymentMethod
    })

    return appointment
  } catch (error) {
    console.log(error)
  }
}
