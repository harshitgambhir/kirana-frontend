import React from 'react';
import { View } from 'react-native';
import Button from '../components/Button';
import Text from '../components/Text';

const Welcome = ({ navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 32,
      }}>
      <View />
      <View>
        <Text
          fontWeight={700}
          textStyle={{
            fontSize: 28,
            textAlign: 'center',
          }}>
          Welcome to Hurry
        </Text>
        <Text
          fontWeight={500}
          textStyle={{
            fontSize: 16,
            textAlign: 'center',
            color: '#58667e',
            marginTop: 8,
          }}>
          Trade NFTs for as low as $1
        </Text>
      </View>
      <Button onPress={() => navigation.navigate('SendOtp')}>
        Continue with email
      </Button>
    </View>
  );
};

export default Welcome;
