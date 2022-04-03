import React from 'react';
import { View, TouchableNativeFeedback, ActivityIndicator } from 'react-native';
import Text from '../Text';

const Button = ({
  children,
  containerStyle,
  loading,
  disabled,
  buttonStyle,
  textStyle,
  textProps,
  ...props
}) => {
  return (
    <View style={containerStyle}>
      <TouchableNativeFeedback {...props} disabled={loading || disabled}>
        <View
          style={[
            {
              backgroundColor: '#3861fb',
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 4,
              opacity: disabled ? 0.5 : 1,
            },
            buttonStyle,
          ]}>
          {loading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <Text
              fontWeight={700}
              textStyle={[
                {
                  fontSize: 16,
                  color: '#fff',
                },
                textStyle,
              ]}
              {...textProps}>
              {children}
            </Text>
          )}
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default Button;
