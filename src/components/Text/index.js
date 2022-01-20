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
        fontFamily: 'NunitoSans-Regular',
      };
      break;
    case 600:
      style = {
        ...style,
        fontFamily: 'NunitoSans-SemiBold',
      };
      break;
    case 800:
      style = {
        ...style,
        fontFamily: 'NunitoSans-ExtraBold',
      };
      break;
    default:
      style = {
        ...style,
        fontFamily: 'NunitoSans-Regular',
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
