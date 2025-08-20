const express = require('express');
const { Conversation, Message } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/:id/messages', authMiddleware, async (req, res) => {
  try {
    const conversationId = req.params.id;
    
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id
    });

    if (!conversation) {
      return res.status(403).json({ error: 'Access denied to this conversation' });
    }

    const messages = await Message.find({ conversationId })
      .populate('senderId', 'username')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const formattedMessages = messages.reverse().map(msg => ({
      id: msg._id,
      content: msg.content,
      status: msg.status,
      createdAt: msg.createdAt,
      readAt: msg.readAt,
      senderId: msg.senderId._id,
      receiverId: msg.receiverId,
      senderUsername: msg.senderId.username
    }));

    res.json(formattedMessages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/start', authMiddleware, async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user.id;

    if (!participantId) {
      return res.status(400).json({ error: 'Participant ID is required' });
    }

    if (participantId === userId) {
      return res.status(400).json({ error: 'Cannot start conversation with yourself' });
    }

    const existingConversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] }
    });

    if (existingConversation) {
      return res.json(existingConversation);
    }

    const conversation = new Conversation({
      participants: [userId, participantId]
    });

    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
