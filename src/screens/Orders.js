import React from 'react';
import { View } from 'react-native';
import Button from '../components/Button';
import Text from '../components/Text';

const Orders = ({ navigation }) => {
  return (
    <View
      style={{
        padding: 12,
      }}>
      <Text
        fontWeight={800}
        textStyle={{
          fontSize: 54,
        }}>
        Orders
      </Text>
    </View>
  );
};

export default Orders;
