import React, { createContext, useContext, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../config';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (token) {
      socketRef.current = io(API_BASE_URL, {
        auth: { token: token }
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [token]);

  const joinConversation = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('join:conversation', conversationId);
    }
  };

  const sendMessage = (messageData) => {
    if (socketRef.current) {
      socketRef.current.emit('message:send', messageData);
    }
  };

  const markMessageAsRead = (messageId, conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('message:read', { messageId, conversationId });
    }
  };

  const startTyping = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('typing:start', { conversationId });
    }
  };

  const stopTyping = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('typing:stop', { conversationId });
    }
  };

  const onNewMessage = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('message:new', callback);
    }
  };

  const onMessageDelivered = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('message:delivered', callback);
    }
  };

  const onMessageRead = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('message:read', callback);
    }
  };

  const onTypingStart = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('typing:start', callback);
    }
  };

  const onTypingStop = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('typing:stop', callback);
    }
  };

  const removeListener = (event) => {
    if (socketRef.current) {
      socketRef.current.off(event);
    }
  };

  const value = {
    joinConversation,
    sendMessage,
    markMessageAsRead,
    startTyping,
    stopTyping,
    onNewMessage,
    onMessageDelivered,
    onMessageRead,
    onTypingStart,
    onTypingStop,
    removeListener
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
