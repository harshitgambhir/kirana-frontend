import React, { useEffect, useRef } from 'react';
import { TextInput, View } from 'react-native';
import { useMutation } from 'react-query';
import Button from '../components/Button';
import Text from '../components/Text';
import * as api from '../api';
import { Formik } from 'formik';
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  email: Yup.string('')
    .email('Please enter a valid email address')
    .required(''),
});

const SendOtp = ({ navigation }) => {
  const formikRef = useRef();

  const { mutate, isLoading, isError, error, isSuccess } = useMutation(
    'sendOtp',
    api.sendOtp,
  );

  useEffect(() => {
    if (isError) {
      formikRef.current.setFieldError(error?.error?.key, error?.error?.message);
    }
    if (isSuccess) {
      navigation.navigate('Login', {
        email: formikRef.current.values.email,
      });
    }
  }, [isSuccess, isError]);

  const onSubmit = values => {
    mutate({
      email: values.email,
    });
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        email: '',
      }}
      onSubmit={onSubmit}
      validationSchema={Schema}
      validateOnMount>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        isValid,
        touched,
      }) => (
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
              What's your email address?
            </Text>
            <Text textStyle={{ marginTop: 8, color: '#666666' }}>
              We will send an email with a verification code to this email
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
                placeholder="Email address"
                keyboardType="email-address"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                autoFocus
              />
            </View>
            {touched.email && errors.email ? (
              <Text
                textStyle={{
                  color: 'red',
                }}>
                {errors.email}
              </Text>
            ) : null}
          </View>
          <Button
            loading={isLoading}
            disabled={!isValid}
            onPress={handleSubmit}>
            Get Code
          </Button>
        </View>
      )}
    </Formik>
  );
};

export default SendOtp;
