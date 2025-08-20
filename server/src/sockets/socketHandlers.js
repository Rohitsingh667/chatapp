const { User, Message, Conversation } = require('../models');

const userSockets = new Map();

module.exports = (io, socket) => {
  userSockets.set(socket.userId, socket.id);
  updateUserOnlineStatus(socket.userId, true);

  socket.on('join:conversation', async (conversationId) => {
    try {
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: socket.userId
      });
      if (conversation) {
        socket.join(`conversation_${conversationId}`);
      }
    } catch (error) {
      console.error('Join conversation error:', error);
    }
  });

  socket.on('message:send', async (data) => {
    try {
      const { conversationId, content, receiverId } = data;

      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: socket.userId
      });

      if (!conversation) {
        return socket.emit('error', { message: 'Access denied to this conversation' });
      }

      const message = new Message({
        conversationId,
        senderId: socket.userId,
        receiverId,
        content,
        status: 'sent'
      });

      await message.save();

      const sender = await User.findById(socket.userId, 'username');

      const messageWithSender = {
        id: message._id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        status: message.status,
        createdAt: message.createdAt,
        readAt: message.readAt,
        senderUsername: sender?.username
      };

      io.to(`conversation_${conversationId}`).emit('message:new', messageWithSender);

      const receiverSocketId = userSockets.get(receiverId);
      if (receiverSocketId) {
        message.status = 'delivered';
        await message.save();
        io.to(receiverSocketId).emit('message:delivered', { messageId: message._id });
      }

      conversation.lastMessage = message._id;
      conversation.lastMessageAt = new Date();
      await conversation.save();

    } catch (error) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('message:read', async (data) => {
    try {
      const { messageId, conversationId } = data;

      const message = await Message.findOneAndUpdate(
        { 
          _id: messageId,
          receiverId: socket.userId
        },
        { 
          status: 'read',
          readAt: new Date()
        },
        { new: true }
      );

      if (message) {
        io.to(`conversation_${conversationId}`).emit('message:read', { messageId });
      }
    } catch (error) {
      console.error('Message read error:', error);
    }
  });

  socket.on('typing:start', async (data) => {
    try {
      const { conversationId } = data;
      socket.to(`conversation_${conversationId}`).emit('typing:start', {
        userId: socket.userId,
        username: socket.user.username
      });
    } catch (error) {
      console.error('Typing start error:', error);
    }
  });

  socket.on('typing:stop', async (data) => {
    try {
      const { conversationId } = data;
      socket.to(`conversation_${conversationId}`).emit('typing:stop', {
        userId: socket.userId
      });
    } catch (error) {
      console.error('Typing stop error:', error);
    }
  });

  socket.on('disconnect', () => {
    userSockets.delete(socket.userId);
    updateUserOnlineStatus(socket.userId, false);
  });
};

async function updateUserOnlineStatus(userId, isOnline) {
  try {
    await User.findByIdAndUpdate(userId, { 
      isOnline,
      lastSeen: new Date()
    });
  } catch (error) {
    console.error('Update online status error:', error);
  }
}
