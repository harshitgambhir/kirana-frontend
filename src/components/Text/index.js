import React from 'react';
import { Text as RNText } from 'react-native';

const Text = ({ children, textStyle, fontWeight, ...props }) => {
  let style = {
    color: '#000',
  };
  switch (fontWeight) {
    case 400:
      style = {
        ...style,
        fontFamily: 'Inter-Regular',
      };
      break;
    case 500:
      style = {
        ...style,
        fontFamily: 'Inter-Medium',
      };
      break;
    case 700:
      style = {
        ...style,
        fontFamily: 'Inter-Bold',
      };
      break;
    default:
      style = {
        ...style,
        fontFamily: 'Inter-Regular',
      };
      break;
  }
  return (
    <RNText style={[style, textStyle]} {...props}>
      {children}
    </RNText>
  );
};

export default Text;
