import React from 'react';
import { View, TextInput } from 'react-native';
import FontAwesome, { SolidIcons } from 'react-native-fontawesome';

const SearchInput = ({ containerStyle, ...props }) => {
  return (
    <View style={containerStyle}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          elevation: 6,
          borderRadius: 8,
          backgroundColor: '#fff',
        }}>
        <FontAwesome
          icon={SolidIcons.search}
          style={{
            fontSize: 20,
            color: '#9ca3af',
            padding: 12,
            borderRadius: 24,
          }}
        />
        <TextInput
          style={{
            fontSize: 16,
            fontFamily: 'NunitoSans-Regular',
            width: '100%',
          }}
          placeholder="search for atta, dal, coke and more"
          placeholderTextColor="#9ca3af"
          {...props}
        />
      </View>
    </View>
  );
};

export default SearchInput;
