import React from 'react';
import { View, Image, TouchableHighlight } from 'react-native';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Button from '../components/Button';
import Text from '../components/Text';
import * as api from '../api';
import Loader from '../components/Loader';
import QuantityButton from '../components/QuantityButton';
import { add, subtract } from '../utils';
import { ChevronRight, ShoppingBag } from 'react-native-feather';

const Item = ({ product: { id, name, price, extra, quantity }, cart }) => {
  const queryClient = useQueryClient();
  const { mutate: mutateUpdateCart } = useMutation(api.updateCart, {
    onMutate: async data => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries('getCart');

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData('getCart');

      // Optimistically update to the new value
      queryClient.setQueryData('getCart', () => {
        return {
          cart: {
            ...data,
          },
        };
      });

      // Return a context object with the snapshotted value
      return { previousCart };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      queryClient.setQueryData('getCart', context.previousCart);
    },
    // // Always refetch after error or success:
    // onSettled: () => {
    //   queryClient.invalidateQueries('getCart');
    // },
  });

  const onMinusPress = async () => {
    if (quantity === 1) {
      const newProducts = await Promise.all(
        cart.products.filter(product => product.id !== id),
      );
      return mutateUpdateCart({
        totalQuantity: cart.totalQuantity - 1,
        totalPrice: subtract(cart.totalPrice, price),
        products: newProducts,
      });
    }
    const newProducts = await Promise.all(
      cart.products.map(product => {
        if (product.id === id) {
          return {
            ...product,
            quantity: product.quantity - 1,
          };
        }
        return product;
      }),
    );
    return mutateUpdateCart({
      totalQuantity: cart.totalQuantity - 1,
      totalPrice: subtract(cart.totalPrice, price),
      products: newProducts,
    });
  };

  const onPlusPress = async () => {
    return mutateUpdateCart({
      totalQuantity: cart.totalQuantity + 1,
      totalPrice: add(cart.totalPrice, price),
      products: [
        ...cart.products,
        {
          id,
          quantity: product.quantity + 1,
        },
      ],
    });
  };

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
          justifyContent: 'space-between',
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
          fontWeight={800}
          textStyle={{
            fontSize: 14,
          }}>
          ₹{price}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            fontWeight={600}
            textStyle={{
              fontSize: 14,
              color: '#666',
            }}>
            {extra}
          </Text>
          <QuantityButton
            value={quantity}
            max={quantity > 10 ? 10 : quantity}
            onMinusPress={onMinusPress}
            onPlusPress={onPlusPress}
          />
        </View>
      </View>
    </View>
  );
};

const Cart = ({ navigation }) => {
  const { data: dataShop } = useQuery('getShop', api.getShop);

  const { data: dataCart } = useQuery('getCart', api.getCart);

  if (!dataShop || !dataCart) {
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

  if (!parseFloat(dataCart.cart.totalQuantity)) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#e5e7eb',
        }}></View>
    );
  }

  return (
    <>
      <View
        style={{
          backgroundColor: '#e5e7eb',
        }}>
        <View
          style={{
            padding: 16,
          }}>
          <Text>{dataCart.cart.totalQuantity} item(s)</Text>
        </View>
        <View
          style={{
            padding: 16,
            backgroundColor: '#fff',
          }}>
          <Text
            fontWeight={800}
            textStyle={{
              fontSize: 18,
            }}>
            Pickup from
          </Text>
          <Text
            textStyle={{
              fontSize: 15,
              color: '#666',
            }}>
            {dataShop.shop.name}
          </Text>
        </View>
        {dataCart.cart.products.map(product => {
          return (
            <Item key={product.id} product={product} cart={dataCart.cart} />
          );
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
              ₹{dataCart.cart.totalPrice}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 16,
            }}>
            <Text fontWeight={600}>bill total</Text>
            <Text fontWeight={600}>₹{dataCart.cart.totalPrice}</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          left: 0,
          width: '100%',
        }}>
        <TouchableHighlight
          onPress={() => navigation.navigate('Orders')}
          style={{
            backgroundColor: '#15803d',
            padding: 8,
            paddingHorizontal: 16,
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
              <ShoppingBag color="#fff" height={24} width={24} />
              <View
                style={{
                  marginLeft: 16,
                }}>
                <Text
                  fontWeight={800}
                  textStyle={{
                    color: '#fff',
                    fontSize: 13,
                  }}>
                  {dataCart.cart.totalQuantity} items
                </Text>
                <Text
                  fontWeight={800}
                  textStyle={{
                    color: '#fff',
                    fontSize: 16,
                  }}>
                  ₹{dataCart.cart.totalPrice}
                </Text>
              </View>
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
                  fontSize: 16,
                }}>
                order
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
    </>
  );
};

export default Cart;
