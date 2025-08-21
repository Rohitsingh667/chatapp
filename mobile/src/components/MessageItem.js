import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageItem = ({ message, isOwnMessage }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageStatus = () => {
    if (!isOwnMessage) return null;
    switch (message.status) {
      case 'sent': return '✓';
      case 'delivered': return '✓✓';
      case 'read': return <Text style={styles.readStatus}>✓✓</Text>;
      default: return null;
    }
  };

  return (
    <View style={[styles.container, isOwnMessage ? styles.ownMessage : styles.otherMessage]}>
      <View style={[styles.bubble, isOwnMessage ? styles.ownBubble : styles.otherBubble]}>
        <Text style={[styles.messageText, isOwnMessage ? styles.ownText : styles.otherText]}>
          {message.content}
        </Text>
        <View style={styles.footer}>
          <Text style={[styles.timestamp, isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp]}>
            {formatTime(message.createdAt)}
          </Text>
          {isOwnMessage && <Text style={styles.status}>{getMessageStatus()}</Text>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5
  },
  ownMessage: {
    alignItems: 'flex-end'
  },
  otherMessage: {
    alignItems: 'flex-start'
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 10,
    padding: 10
  },
  ownBubble: {
    backgroundColor: '#007AFF'
  },
  otherBubble: {
    backgroundColor: '#f0f0f0'
  },
  messageText: {
    fontSize: 16
  },
  ownText: {
    color: '#fff'
  },
  otherText: {
    color: '#000'
  },
  footer: {
    flexDirection: 'row',
    marginTop: 5
  },
  timestamp: {
    fontSize: 10,
    marginRight: 5
  },
  ownTimestamp: {
    color: '#fff'
  },
  otherTimestamp: {
    color: '#666'
  },
  status: {
    fontSize: 10,
    color: '#fff'
  },
  readStatus: {
    color: '#00ff00'
  }
});

export default MessageItem;
