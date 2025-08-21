import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { conversationAPI } from '../services/api';
import MessageItem from '../components/MessageItem';
import TypingIndicator from '../components/TypingIndicator';

const ChatScreen = ({ route }) => {
  const { conversationId, participant } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const { token, user } = useAuth();
  const {
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
  } = useSocket();
  
  const flatListRef = useRef();
  const typingTimeoutRef = useRef();

  useEffect(() => {
    loadMessages();
    joinConversation(conversationId);
    
    onNewMessage(handleNewMessage);
    onMessageDelivered(handleMessageDelivered);
    onMessageRead(handleMessageRead);
    onTypingStart(handleTypingStart);
    onTypingStop(handleTypingStop);

    return () => {
      removeListener('message:new');
      removeListener('message:delivered');
      removeListener('message:read');
      removeListener('typing:start');
      removeListener('typing:stop');
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversationId]);

  const loadMessages = async () => {
    try {
      const messagesData = await conversationAPI.getMessages(token, conversationId);
      setMessages(messagesData);
      messagesData.forEach(message => {
        if (message.receiverId === user.id && message.status !== 'read') {
          markMessageAsRead(message.id, conversationId);
        }
      });
    } catch (error) {
      console.error('Load messages error:', error);
    }
  };

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
    if (message.receiverId === user.id) {
      markMessageAsRead(message.id, conversationId);
    }
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleMessageDelivered = ({ messageId }) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'delivered' } : msg
      )
    );
  };

  const handleMessageRead = ({ messageId }) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'read', readAt: new Date() } : msg
      )
    );
  };

  const handleTypingStart = ({ userId, username }) => {
    if (userId !== user.id) {
      setTypingUsers(prev => {
        if (!prev.find(user => user.id === userId)) {
          return [...prev, { id: userId, username }];
        }
        return prev;
      });
    }
  };

  const handleTypingStop = ({ userId }) => {
    setTypingUsers(prev => prev.filter(user => user.id !== userId));
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const messageData = {
      conversationId,
      content: inputText.trim(),
      receiverId: participant.id
    };

    sendMessage(messageData);
    setInputText('');
    
    if (isTyping) {
      stopTyping(conversationId);
      setIsTyping(false);
    }
  };

  const handleTyping = (text) => {
    setInputText(text);
    
    if (text.trim() && !isTyping) {
      setIsTyping(true);
      startTyping(conversationId);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        stopTyping(conversationId);
        setIsTyping(false);
      }
    }, 2000);
  };

  const renderMessage = ({ item }) => (
    <MessageItem message={item} isOwnMessage={item.senderId === user.id} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />
      
      {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={handleTyping}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  messagesList: {
    flex: 1,
    padding: 10
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    backgroundColor: '#f8f8f8'
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center'
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc'
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default ChatScreen;
