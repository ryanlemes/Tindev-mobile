import React, {useState, useEffect} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import api from '../../services/api';

import styles from './style';
import logo from '../../assets/logo.png';

export default function Login({navigation}) {
  const [user, setUser] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('user').then(users => {
      if (users) {
        navigation.navigate('Main', {users});
      }
    });
  }, [navigation]);

  async function handleLogin() {
    const response = await api.post('/dev', {
      username: user,
    });
    const {_id} = response.data;

    await AsyncStorage.setItem('user', _id);

    navigation.navigate('Main', {user: _id});
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled={Platform.OS === 'ios'}
      style={styles.container}>
      <Image source={logo} />
      <TextInput
        autoCapitalize="none"
        style={styles.input}
        autoCorrect={false}
        placeholder="Type your Github Username"
        placeholderTextColor="#999"
        value={user}
        onChangeText={setUser}
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
