import React from 'react';
import { ActivityIndicator, View } from 'react-native';

const Loader = ({ containerStyle, ...props }) => {
  return (
    <View style={containerStyle}>
      <ActivityIndicator color="#000" size="large" {...props} />
    </View>
  );
};

export default Loader;
