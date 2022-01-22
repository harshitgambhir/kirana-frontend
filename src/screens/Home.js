import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Text from '../components/Text';
import * as api from '../api';
import { useQuery } from 'react-query';
import Loader from '../components/Loader';
import { Search, User } from 'react-native-feather';
import FloatingCart from '../components/FloatingCart';

const windowWidth = Dimensions.get('window').width;

const Home = ({ navigation }) => {
  const { data } = useQuery('getUser', api.getUser);
  const { data: dataShop, isLoading: shopIsLoading } = useQuery(
    'getShop',
    api.getShop,
  );
  const { data: dataCategories, isLoading: isLoadingCategories } = useQuery(
    'getCategories',
    api.getCategories,
  );

  if (shopIsLoading || isLoadingCategories) {
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
    <>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 60,
        }}>
        <View
          style={{
            marginTop: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <Text
              fontWeight={800}
              textStyle={{
                fontSize: 22,
              }}>
              Pickup from
            </Text>
            <Text
              textStyle={{
                fontSize: 18,
              }}>
              {dataShop.shop.name}
            </Text>
          </View>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('Account')}>
            <View
              style={{
                color: '#000',
                backgroundColor: '#deedd6',
                padding: 10,
                borderRadius: 12,
              }}>
              <User stroke="#666" height={24} width={24} />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('Search');
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              elevation: 4,
              borderRadius: 8,
              backgroundColor: '#fff',
              marginTop: 20,
              paddingHorizontal: 12,
              paddingVertical: 12,
            }}>
            <Search color="#9ca3af" height={24} width={24} />
            <Text
              textStyle={{
                color: '#9ca3af',
                fontSize: 16,
                marginLeft: 12,
              }}>
              search for atta, dal, coke and more
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <Text
          fontWeight={800}
          textStyle={{
            fontSize: 16,
            marginTop: 20,
          }}>
          shop by category
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            marginTop: 16,
          }}>
          {dataCategories.categories.map((category, index) => {
            return (
              <TouchableWithoutFeedback
                key={category.id}
                onPress={() =>
                  navigation.navigate('Category', {
                    id: category.id,
                    name: category.name,
                  })
                }>
                <View
                  style={{
                    width: (windowWidth - 62) / 4,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                    marginLeft: index % 4 !== 0 ? 10 : 0,
                  }}>
                  <View
                    style={{
                      height: 82,
                      width: 82,
                      backgroundColor: '#deedd6',
                      borderRadius: 12,
                    }}>
                    <Image source={{ uri: category.image }} />
                  </View>
                  <Text
                    fontWeight={600}
                    textStyle={{
                      textAlign: 'center',
                      paddingHorizontal: 4,
                      marginTop: 4,
                    }}>
                    {category.name}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      </ScrollView>
      <FloatingCart />
    </>
  );
};

export default Home;
