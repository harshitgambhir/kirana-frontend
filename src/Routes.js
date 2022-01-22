import React from 'react';
import { useQuery } from 'react-query';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as api from './api';
import Welcome from './screens/Welcome';
import SendOtp from './screens/SendOtp';
import Login from './screens/Login';
import Home from './screens/Home';
import Account from './screens/Account';
import Category from './screens/Category';
import Cart from './screens/Cart';
import Orders from './screens/Orders';
import Order from './screens/Order';

const Stack = createNativeStackNavigator();

const Routes = () => {
  const { data, isLoading } = useQuery('getUser', api.getUser);

  if (data?.user) {
    return (
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
          headerTintColor: '#000',
        }}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Account"
          component={Account}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Category"
          component={Category}
          options={({ route }) => ({
            headerTitle: route.params.name,
            headerStyle: {
              backgroundColor: '#ffffff',
              elevation: 0,
            },
            headerShadowVisible: false,
          })}
        />
        <Stack.Screen
          name="Cart"
          component={Cart}
          options={{
            headerTitle: 'my cart',
            headerStyle: {
              backgroundColor: '#ffffff',
              elevation: 0,
            },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="Orders"
          component={Orders}
          options={{
            headerTitle: 'my orders',
            headerStyle: {
              backgroundColor: '#ffffff',
              elevation: 0,
            },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="Order"
          component={Order}
          options={{
            headerTitle: 'order details',
            headerStyle: {
              backgroundColor: '#ffffff',
              elevation: 0,
            },
            headerShadowVisible: false,
          }}
        />
      </Stack.Navigator>
    );
  }
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
        headerTintColor: '#000',
      }}>
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SendOtp"
        component={SendOtp}
        options={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#ffffff',
            elevation: 0,
          },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#ffffff',
            elevation: 0,
          },
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default Routes;
