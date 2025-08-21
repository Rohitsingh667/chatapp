import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TypingIndicator = ({ users }) => {
  if (users.length === 0) return null;

  const getTypingText = () => {
    if (users.length === 1) {
      return `${users[0].username} is typing...`;
    }
    return `${users[0].username} and ${users.length - 1} others are typing...`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{getTypingText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  text: {
    fontSize: 12,
    color: '#666'
  }
});

export default TypingIndicator;
