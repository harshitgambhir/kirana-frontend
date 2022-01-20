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

export const getUser = () => api.get('/user').then(res => res.data);

export const updateLocation = data =>
  api.put(`/user/location`, data).then(res => res.data);

export const updateCart = data => api.put(`/cart`, data).then(res => res.data);

export const getCart = () => api.get('/cart').then(res => res.data);

export const addOrder = data => api.post(`/order`, data).then(res => res.data);

export const searchProducts = () => api.get(`/search`).then(res => res.data);

export const getShop = () => api.get('/shop').then(res => res.data);

export const getCategories = () => api.get('/categories').then(res => res.data);

export const getCategories2 = id =>
  api.get(`/categories/${id}/categories2`).then(res => res.data);
export const getProducts = id =>
  api.get(`/categories2/${id}/products`).then(res => res.data);

export const getOrders = () => api.get(`/orders`).then(res => res.data);
export const getOrder = id => api.get(`/orders/${id}`).then(res => res.data);
