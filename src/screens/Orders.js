import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import Text from '../components/Text';
import moment from 'moment';
import { useQuery } from 'react-query';
import * as api from '../api';
import Loader from '../components/Loader';

const Orders = ({ navigation }) => {
  const { data, isFetching } = useQuery('getOrders', api.getOrders, {
    refetchOnMount: 'always',
  });

  if (isFetching || !data) {
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

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.5}
        onPress={() =>
          navigation.navigate('Order', {
            id: item.id,
          })
        }>
        <View
          style={{
            padding: 16,
          }}>
          <Text
            textStyle={{
              fontSize: 14,
              color: '#666',
            }}>
            placed on{' '}
            {moment(item.createdAt).format('ddd, D MMM, hh:mm a').toLowerCase()}
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
              <Text fontWeight={800}>{item.totalQuantity} item(s)</Text>
              <Text fontWeight={600}>₹{item.totalPrice}</Text>
            </View>
            <Text
              textStyle={{
                marginTop: 8,
              }}
              fontWeight={600}>
              order id : {item.id}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data.orders}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      ItemSeparatorComponent={() => {
        return (
          <View
            style={{
              height: 1,
              backgroundColor: '#e5e7eb',
            }}
          />
        );
      }}
    />
  );
};

export default Orders;
