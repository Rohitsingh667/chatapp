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
        <Text style={styles.status}>{user.isOnline ? 'Online' : 'Offline'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  avatarText: {
    color: '#fff',
    fontSize: 14
  },
  content: {
    flex: 1
  },
  username: {
    fontSize: 16
  },
  status: {
    fontSize: 12,
    color: '#666'
  }
});

export default UserListItem;
