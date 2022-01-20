import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import Routes from './src/Routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      refetchOnMount: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const App = () => {
  return (
    <>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <NavigationContainer
        theme={{
          colors: {
            background: '#ffffff',
          },
        }}>
        <QueryClientProvider client={queryClient}>
          <Routes />
        </QueryClientProvider>
      </NavigationContainer>
    </>
  );
};

export default App;
