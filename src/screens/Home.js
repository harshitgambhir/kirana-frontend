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
          paddingHorizontal: 24,
          paddingVertical: 20,
        }}>
        <Text
          fontWeight={500}
          textStyle={{
            fontSize: 30,
          }}>
          Investing
        </Text>
        <Text
          fontWeight={500}
          textStyle={{
            fontSize: 30,
          }}>
          Ξ30,000
        </Text>
      </ScrollView>
    </>
  );
};

export default Home;
