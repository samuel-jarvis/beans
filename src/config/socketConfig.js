const socketio = require('socket.io')

let io
modules.exports = {
  init: function (server) {
    io = socketio(server)
    return io
  },
  getIO: function () {
    if (!io) {
      throw new Error("Can't get io instance before calling .init()")
    }
    return io
  }
}
