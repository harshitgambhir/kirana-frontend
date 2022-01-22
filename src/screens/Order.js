import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import Text from '../components/Text';
import moment from 'moment';
import { useQuery } from 'react-query';
import * as api from '../api';
import { Loader } from 'react-native-feather';

const Item = ({ product: { id, name, price, extra, quantity } }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 150,
        paddingVertical: 16,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
      }}>
      <Image
        style={{
          height: '100%',
          width: 120,
        }}
      />
      <View
        style={{
          height: '100%',
          flex: 1,
        }}>
        <Text
          fontWeight={600}
          textStyle={{
            fontSize: 14,
          }}
          numnberOfLines={2}>
          {name}
        </Text>
        <Text
          fontWeight={600}
          textStyle={{
            fontSize: 14,
            color: '#666',
            marginTop: 8,
          }}>
          {extra}
        </Text>
        <Text
          fontWeight={600}
          textStyle={{
            fontSize: 14,
            marginTop: 8,
          }}>
          ₹{price} x {quantity}
        </Text>
      </View>
    </View>
  );
};

const Order = ({ route, navigation }) => {
  const { data } = useQuery(['getOrder', route.params.id], () =>
    api.getOrder(route.params.id),
  );
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
    <ScrollView
      contentContainerStyle={{
        backgroundColor: '#e5e7eb',
      }}>
      <Text
        textStyle={{
          fontSize: 14,
          color: '#666',
          paddingHorizontal: 16,
          paddingVertical: 4,
          backgroundColor: '#fff',
        }}>
        placed on{' '}
        {moment(data.order.createdAt)
          .format('ddd, D MMM, hh:mm a')
          .toLowerCase()}
      </Text>
      <View
        style={{
          padding: 16,
          backgroundColor: '#fff',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            fontWeight={800}
            textStyle={{
              fontSize: 18,
            }}>
            Pickup from
          </Text>
          <Text
            fontWeight={600}
            textStyle={{
              fontSize: 14,
              backgroundColor: '#deedd6',
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}>
            OTP : {data.order.otp}
          </Text>
        </View>
        <Text
          textStyle={{
            fontSize: 15,
            color: '#666',
          }}>
          {data.order.shop.name}
        </Text>
      </View>
      <View
        style={{
          padding: 16,
          paddingVertical: 8,
          backgroundColor: '#fafafa',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 8,
        }}>
        <Text
          textStyle={{
            color: '#666',
          }}>
          {data.order.totalQuantity} item(s)
        </Text>
        <Text
          fontWeight={800}
          textStyle={{
            marginLeft: 16,
            color: '#666',
          }}>
          ·
        </Text>
        <Text
          textStyle={{
            marginLeft: 16,
            color: '#666',
          }}>
          order id : {data.order.id}
        </Text>
      </View>
      {data.order.products.map(product => {
        return <Item key={product.id} product={product} />;
      })}
      <View
        style={{
          padding: 16,
          backgroundColor: '#fff',
          marginTop: 8,
        }}>
        <Text
          fontWeight={800}
          textStyle={{
            fontSize: 16,
          }}>
          bill details
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 6,
            marginTop: 8,
          }}>
          <Text
            textStyle={{
              color: '#666',
            }}>
            MRP
          </Text>
          <Text
            textStyle={{
              color: '#666',
            }}>
            ₹{data.order.totalPrice}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
          }}>
          <Text fontWeight={600}>total</Text>
          <Text fontWeight={600}>₹{data.order.totalPrice}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Order;
