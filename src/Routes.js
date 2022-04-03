import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import * as api from './api';
import Welcome from './screens/Welcome';
import SendOtp from './screens/SendOtp';
import Login from './screens/Login';
import Home from './screens/Home';
import Onboard from './screens/Onboard';

const Stack = createNativeStackNavigator();

const Routes = () => {
  const { data, isLoading } = useQuery('getProfile', api.getProfile);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hide();
    }
  }, [isLoading]);

  if (data?.user) {
    if (data?.user?.name) {
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
          name="Onboard"
          component={Onboard}
          options={{
            headerShown: false,
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
