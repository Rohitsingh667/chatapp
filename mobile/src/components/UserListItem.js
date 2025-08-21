import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const UserListItem = ({ user, onPress }) => {
  const getInitials = (username) => {
    return username ? username.substring(0, 2).toUpperCase() : '??';
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(user.username)}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.username}>{user.username}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: user.isOnline ? '#34C759' : '#8E8E93' }]} />
          <Text style={styles.status}>{user.isOnline ? 'Online' : 'Offline'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  content: {
    flex: 1
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8
  },
  status: {
    fontSize: 12,
    color: '#666'
  }
});

export default UserListItem;
