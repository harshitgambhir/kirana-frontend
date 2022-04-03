import axios from 'axios';
import { API_URL } from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-community/cookies';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async config => {
  config.headers['Cookie'] = await AsyncStorage.getItem('CSID');
  return config;
});

api.interceptors.response.use(async response => {
  if (response.config.url === '/login') {
    await AsyncStorage.setItem('CSID', response.headers['set-cookie'][0]);
  }
  if (response.config.url === '/logout') {
    await CookieManager.clearAll();
    await AsyncStorage.removeItem('CSID');
  }
  return response;
});

export const sendOtp = data =>
  api
    .post('/send-otp', data)
    .then(res => res.data)
    .catch(error => {
      throw error.response.data;
    });

export const login = data =>
  api
    .post('/login', data)
    .then(res => res.data)
    .catch(error => {
      throw error.response.data;
    });

export const logout = () => api.post('/logout').then(res => res.data);

export const getProfile = () => api.get('/profile').then(res => res.data);
