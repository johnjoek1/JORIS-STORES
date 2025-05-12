function setupSocket(io) {
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
      socket.on('joinOrder', (orderId) => {
        socket.join(orderId);
      });
    });
  }
  
  module.exports = setupSocket;