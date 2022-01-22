import React from 'react';
import { View, TouchableOpacity, TouchableHighlight } from 'react-native';
import { ShoppingBag, ChevronRight } from 'react-native-feather';
import { useQuery } from 'react-query';
import Text from '../Text';
import * as api from '../../api';
import { useNavigation } from '@react-navigation/native';

const FloatingCart = () => {
  const navigation = useNavigation();
  const { data } = useQuery('getCart', api.getCart);

  if (!data?.cart?.products?.length) {
    return null;
  }

  return (
    <View
      style={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        left: 0,
        width: '100%',
        padding: 16,
      }}>
      <TouchableHighlight
        onPress={() => navigation.navigate('Cart')}
        style={{
          backgroundColor: '#0AAD0A',
          borderRadius: 8,
          padding: 12,
        }}
        underlayColor={'#16a34a'}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <ShoppingBag color="#fff" height={20} width={20} />
            <Text
              fontWeight={800}
              textStyle={{
                color: '#fff',
                marginLeft: 16,
              }}>
              {data.cart.totalQuantity} item
            </Text>
            <Text
              fontWeight={800}
              textStyle={{
                color: '#fff',
                marginLeft: 8,
              }}>
              |
            </Text>
            <Text
              fontWeight={800}
              textStyle={{
                color: '#fff',
                marginLeft: 8,
              }}>
              ₹{data.cart.totalPrice}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              fontWeight={800}
              textStyle={{
                color: '#fff',
              }}>
              view cart
            </Text>
            <ChevronRight
              color="#fff"
              height={20}
              width={20}
              style={{
                marginLeft: 8,
              }}
            />
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

export default FloatingCart;
