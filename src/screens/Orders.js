import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import Text from '../components/Text';
import moment from 'moment';
import { useQuery } from 'react-query';
import * as api from '../api';
import { Loader } from 'react-native-feather';

const Orders = ({ navigation }) => {
  const { data } = useQuery('getOrders', api.getOrders);
  console.log(data);
  if (!data) {
    return (
      <Loader
        containerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    );
  }

  return (
    <View>
      {data.orders.map((order, index) => {
        return (
          <TouchableOpacity
            key={order.id}
            activeOpacity={0.5}
            onPress={() =>
              navigation.navigate('Order', {
                id: order.id,
              })
            }>
            <View
              style={{
                padding: 16,
                borderTopWidth: index ? 1 : 0,
                borderTopColor: '#e5e7eb',
              }}>
              <Text
                textStyle={{
                  fontSize: 14,
                  color: '#666',
                }}>
                placed on{' '}
                {moment(order.createdAt)
                  .format('ddd, D MMM, hh:mm a')
                  .toLowerCase()}
              </Text>
              <View
                style={{
                  marginTop: 16,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text fontWeight={800}>{order.totalQuantity} item(s)</Text>
                  <Text fontWeight={600}>₹{order.totalPrice}</Text>
                </View>
                <Text
                  textStyle={{
                    marginTop: 8,
                  }}
                  fontWeight={600}>
                  order id : {order.id}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Orders;
