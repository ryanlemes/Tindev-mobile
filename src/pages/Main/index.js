import React, {useEffect, useState} from 'react';

import {SafeAreaView, Image, View, Text, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../services/api';

import styles from './style';

import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import logo from '../../assets/logo.png';

export default function Main({navigation}) {
  const id = navigation.getParam('user');

  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/dev', {
        headers: {
          user: id,
        },
      });

      setUsers(response.data);
    }

    loadUsers();
  }, [id]);

  async function handleLike() {
    const [user, ...rest] = users;

    await api.post(`dev/${user._id}/like`, null, {
      headers: {
        user: id,
      },
    });
    setUsers(rest);
  }

  async function handleDislike() {
    const [user, ...rest] = users;

    await api.post(`dev/${user._id}/dislike`, null, {
      headers: {
        user: id,
      },
    });
    setUsers(rest);
  }

  async function handleLogout() {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image source={logo} style={styles.logo} />
      </TouchableOpacity>
      <View style={styles.cardsContainer}>
        {users.length === 0 ? (
          <Text style={styles.empty}>Over :(</Text>
        ) : (
          users.map((user, index) => (
            <View
              key={user._id}
              style={[styles.card, {zIndex: users.length - index}]}>
              <Image style={styles.avatar} source={{uri: user.avatar}} />
              <View style={styles.footer}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.bio} numberOfLines={3}>
                  {user.bio}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {users.length > 0 ? (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleDislike}>
            <Image source={dislike} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLike}>
            <Image source={like} />
          </TouchableOpacity>
        </View>
      ) : (
        <View />
      )}
    </SafeAreaView>
  );
}
