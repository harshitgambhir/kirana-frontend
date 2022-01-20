import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import Text from '../components/Text';
import * as api from '../api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ShoppingBag, LogOut } from 'react-native-feather';

const Item = ({ onPress, icon, title }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
        }}>
        <View
          style={{
            color: '#000',
            backgroundColor: '#eee',
            padding: 10,
            borderRadius: 12,
          }}>
          {icon}
        </View>
        <Text textStyle={{ marginLeft: 16, fontSize: 16 }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Home = ({ navigation }) => {
  const { data } = useQuery('getUser', api.getUser);
  const queryClient = useQueryClient();
  const { mutate: mutateLogout } = useMutation('logout', api.logout, {
    onSuccess: () => {
      queryClient.setQueryData('getUser', null);
    },
  });

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 16,
      }}>
      <Text
        fontWeight={800}
        textStyle={{
          fontSize: 22,
          marginTop: 16,
        }}>
        my account
      </Text>
      <Text
        textStyle={{
          fontSize: 16,
          color: '#666',
        }}>
        {data?.user.mobile}
      </Text>
      <View
        style={{
          marginTop: 16,
        }}>
        <Item
          title="my orders"
          onPress={() => navigation.navigate('Orders')}
          icon={<ShoppingBag stroke="#666" height={20} width={20} />}
        />
        <Item
          title="logout"
          onPress={() => mutateLogout()}
          icon={<LogOut stroke="#666" height={20} width={20} />}
        />
      </View>
    </ScrollView>
  );
};

export default Home;
