import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Text from '../components/Text';
import * as api from '../api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Loader from '../components/Loader';
import { Search, User } from 'react-native-feather';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { useEffect } from 'react/cjs/react.development';
import Button from '../components/Button';
import QuantityButton from '../components/QuantityButton';
import FloatingCart from '../components/FloatingCart';
import { add, subtract } from '../utils';

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

const TabScene = ({ products, cart }) => {
  if (!products.length || !cart) {
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
    return <Item {...item} cart={cart} />;
  };

  return (
    <FlatList
      data={products}
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
    />
  );
};

const Category = ({ route, navigation }) => {
  const { data, isLoading, isSuccess } = useQuery(
    ['getCategories2', route.params.id],
    () => api.getCategories2(route.params.id),
  );

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [products, setProducts] = useState({});
  const currentCategoryId = data?.categories[index].id;

  const {
    mutate: mutateGetProducts,
    isSuccess: isSuccessGetProducts,
    data: dataProducts,
  } = useMutation(['getProducts', currentCategoryId], () =>
    api.getProducts(currentCategoryId),
  );

  const { data: dataGetCart } = useQuery('getCart', api.getCart);

  useEffect(() => {
    if (isSuccess) {
      setRoutes(
        data.categories.map(category => {
          return {
            key: category.id,
            title: category.name,
          };
        }),
      );
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessGetProducts) {
      setProducts({
        ...products,
        [data?.categories[index].id]: dataProducts?.products,
      });
    }
  }, [isSuccessGetProducts]);

  useEffect(() => {
    if (data?.categories && !products[currentCategoryId]) {
      mutateGetProducts(currentCategoryId);
    }
  }, [index, data?.categories]);

  if (!data?.categories || !routes.length) {
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

  const renderScene = SceneMap(
    routes.reduce(
      (obj, item, _index) => (
        (obj[item.key] = () => (
          <TabScene
            products={products[item.key] || []}
            cart={dataGetCart?.cart}
          />
        )),
        obj
      ),
      {},
    ),
  );

  const renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      labelStyle={styles.label}
      tabStyle={styles.tabStyle}
      renderLabel={({ route }) => <Text fontWeight={800}>{route.title}</Text>}
    />
  );

  const handleIndexChange = index => {
    setIndex(index);
  };

  return (
    <>
      <TabView
        navigationState={{
          index,
          routes,
        }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={handleIndexChange}
      />
      <FloatingCart />
    </>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: '#fff',
  },
  indicator: {
    backgroundColor: '#000',
  },
  tabStyle: {
    width: 'auto',
  },
});

export default Category;
