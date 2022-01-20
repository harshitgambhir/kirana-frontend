import React from 'react';
import { View } from 'react-native';
import Button from '../components/Button';
import Text from '../components/Text';

const Welcome = ({ navigation }) => {
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
        Welcome
      </Text>
      <Button onPress={() => navigation.navigate('SendOtp')}>Continue</Button>
    </View>
  );
};

export default Welcome;
