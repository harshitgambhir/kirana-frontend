import React from 'react';
import { ScrollView } from 'react-native';
import Text from '../components/Text';
import * as api from '../api';
import { useQuery } from 'react-query';

const Home = ({ navigation }) => {
  const { data } = useQuery('getProfile', api.getProfile);
  return (
    <>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 60,
        }}>
        <Text
          fontWeight={700}
          textStyle={{
            fontSize: 22,
          }}>
          Account
        </Text>
      </ScrollView>
    </>
  );
};

export default Home;
