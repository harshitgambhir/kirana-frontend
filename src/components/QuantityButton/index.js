import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Minus, Plus } from 'react-native-feather';
import Text from '../Text';

const QuantityButton = ({
  containerStyle,
  max,
  value,
  onMinusPress,
  onPlusPress,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#15803d',
        borderRadius: 4,
      }}>
      <TouchableWithoutFeedback onPress={onMinusPress}>
        <View style={{ paddingHorizontal: 8, paddingVertical: 6 }}>
          <Minus stroke="#fff" height={16} width={16} />
        </View>
      </TouchableWithoutFeedback>
      <Text
        textStyle={[
          {
            fontSize: 14,
            color: '#fff',
            paddingHorizontal: 4,
            paddingVertical: 6,
          },
        ]}>
        {value}
      </Text>
      <TouchableWithoutFeedback disabled={value === max} onPress={onPlusPress}>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 6,
            opacity: value === max ? 0.5 : 1,
          }}>
          <Plus stroke={'#fff'} height={16} width={16} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default QuantityButton;
