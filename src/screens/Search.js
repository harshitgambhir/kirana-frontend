import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Text from '../components/Text';
import * as api from '../api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Loader from '../components/Loader';
import FloatingCart from '../components/FloatingCart';
import SearchInput from '../components/SearchInput';
import QuantityButton from '../components/QuantityButton';
import { useDebounce } from '../hooks';
import { subtract, add } from '../utils';
import Button from '../components/Button';

const Item = ({ id, name, price, extra, cart, image, quantity }) => {
  const product = cart.products.find(product => product.id === id);
  const value = product?.quantity || 1;

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

  const onAddPress = async () => {
    const newProducts = [
      ...cart.products,
      {
        id,
        name,
        price,
        extra,
        image,
        quantity: value,
      },
    ];

    mutateUpdateCart({
      totalQuantity: cart.totalQuantity + 1,
      totalPrice: add(cart.totalPrice, price),
      products: newProducts,
    });
  };

  const onMinusPress = async () => {
    if (value === 1) {
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
      }}>
      <Image
        style={{
          height: '100%',
          width: 120,
        }}
        source={{ uri: image }}
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
          {product ? (
            <QuantityButton
              value={value}
              max={quantity > 10 ? 10 : quantity}
              onMinusPress={onMinusPress}
              onPlusPress={onPlusPress}
            />
          ) : (
            <Button
              buttonStyle={{
                height: 31,
                width: 80,
              }}
              textProps={{
                fontWeight: 400,
              }}
              textStyle={{
                fontSize: 14,
              }}
              onPress={onAddPress}>
              add
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};

const Search = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const { data: dataGetCart } = useQuery('getCart', api.getCart);

  const {
    mutate,
    data,
    isLoading: isLoading,
    reset,
  } = useMutation('searchProducts', api.searchProducts);

  useEffect(() => {
    if (debouncedQuery) {
      mutate({
        query: debouncedQuery,
      });
    } else {
      reset();
    }
  }, [debouncedQuery]);

  const renderItem = ({ item }) => {
    return <Item {...item} cart={dataGetCart.cart} />;
  };

  return (
    <>
      <SearchInput
        containerStyle={{
          padding: 16,
        }}
        onChangeText={setQuery}
        autoFocus={true}
      />
      {isLoading || !dataGetCart ? (
        <Loader
          containerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      ) : (
        <FlatList
          data={data?.products}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  height: 1,
                  backgroundColor: '#eee',
                }}
              />
            );
          }}
          ListFooterComponent={() => (
            <View
              style={{
                paddingBottom: 58,
              }}
            />
          )}
        />
      )}

      <FloatingCart />
    </>
  );
};

export default Search;
