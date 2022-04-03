import React, { useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useMutation, useQueryClient } from 'react-query';
import Text from '../components/Text';
import * as api from '../api';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CookieManager from '@react-native-community/cookies';

const Schema = Yup.object().shape({
  otp: Yup.string().min(4, '').max(4, '').required(''),
});

const Login = ({ route, navigation }) => {
  const { email } = route.params;
  const formikRef = useRef();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds !== 0) {
      const interval = setInterval(() => {
        setSeconds(seconds - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [seconds]);

  const queryClient = useQueryClient();

  const { mutate, isLoading, isError, error, isSuccess } = useMutation(
    'login',
    api.login,
    {
      onSuccess: newData => {
        queryClient.setQueryData('getProfile', newData);
      },
    },
  );

  const { mutate: mutateSendOtp } = useMutation('sendOtp', api.sendOtp);

  useEffect(() => {
    if (isError) {
      formikRef.current.setFieldError(error?.error?.key, error?.error?.message);
    }
  }, [isError]);

  const onSubmit = async values => {
    await CookieManager.clearAll();
    mutate({
      email,
      otp: values.otp,
    });
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        otp: '',
      }}
      validationSchema={Schema}
      validateOnMount>
      {({ handleChange, handleBlur, values, errors, touched }) => (
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingBottom: 18,
          }}>
          <View>
            <Text
              fontWeight={700}
              textStyle={{
                fontSize: 24,
              }}>
              Verification code
            </Text>
            <Text textStyle={{ marginTop: 8, color: '#666666' }}>
              We've sent a verification code on {email} to proceed
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 18,
              }}>
              <TextInput
                style={{
                  fontSize: 18,
                  fontFamily: 'Inter-Medium',
                  width: '100%',
                  backgroundColor: '#eee',
                  borderRadius: 4,
                  paddingHorizontal: 16,
                }}
                placeholder="Enter code"
                maxLength={4}
                keyboardType="phone-pad"
                onChangeText={text => {
                  handleChange('otp')(text);
                  if (text.length === 4) {
                    onSubmit({
                      otp: text,
                    });
                  }
                }}
                onBlur={handleBlur('otp')}
                value={values.otp}
                autoFocus
              />
            </View>
            {errors.otp ? (
              <Text
                textStyle={{
                  color: 'red',
                }}>
                {errors.otp}
              </Text>
            ) : null}
          </View>
          {seconds !== 0 ? (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text
                textStyle={{
                  color: '#666666',
                }}>
                resend otp in
              </Text>
              <Text
                fontWeight={700}
                textStyle={{
                  marginLeft: 8,
                }}>
                00:
                {seconds.toString().length == 1
                  ? '0' + seconds.toString()
                  : seconds}
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text
                textStyle={{
                  color: '#666666',
                }}>
                didn't receive code
              </Text>
              <Text
                fontWeight={700}
                textStyle={{
                  color: '#666666',
                  marginLeft: 8,
                  color: '#3861fb',
                }}
                onPress={() => {
                  mutateSendOtp({
                    email,
                  });
                  setSeconds(60);
                }}>
                resend code
              </Text>
            </View>
          )}
        </View>
      )}
    </Formik>
  );
};

export default Login;
