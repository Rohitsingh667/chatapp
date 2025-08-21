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
    marginVertical: 2,
    marginHorizontal: 10
  },
  ownMessage: {
    alignItems: 'flex-end'
  },
  otherMessage: {
    alignItems: 'flex-start'
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  ownBubble: {
    backgroundColor: '#007AFF'
  },
  otherBubble: {
    backgroundColor: '#fff'
  },
  messageText: {
    fontSize: 16
  },
  ownText: {
    color: '#fff'
  },
  otherText: {
    color: '#333'
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'flex-end'
  },
  timestamp: {
    fontSize: 12,
    marginRight: 5
  },
  ownTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)'
  },
  otherTimestamp: {
    color: '#999'
  },
  status: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)'
  },
  readStatus: {
    color: '#34C759'
  }
});

export default MessageItem;
