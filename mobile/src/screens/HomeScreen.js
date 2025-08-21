import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { userAPI, conversationAPI } from '../services/api';
import UserListItem from '../components/UserListItem';

const HomeScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await userAPI.getUsers(token);
      setUsers(usersData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const startChat = async (participant) => {
    try {
      const conversation = await conversationAPI.startConversation(token, participant.id);
      navigation.navigate('Chat', {
        conversationId: conversation.id,
        participant,
        username: participant.username
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to start conversation');
    }
  };

  const renderUser = ({ item }) => (
    <UserListItem user={item} onPress={() => startChat(item)} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    color: '#333'
  }
});

export default HomeScreen;
