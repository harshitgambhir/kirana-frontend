import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
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
      <TouchableOpacity
        activeOpacity={0.5}
        {...props}
        disabled={loading || disabled}>
        <View
          style={[
            {
              backgroundColor: '#0AAD0A',
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 4,
              opacity: disabled ? 0.6 : 1,
            },
            buttonStyle,
          ]}>
          {loading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <Text
              fontWeight={800}
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
      </TouchableOpacity>
    </View>
  );
};

export default Button;
