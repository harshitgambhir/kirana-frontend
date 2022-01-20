import React, { useEffect, useRef } from 'react';
import { TextInput, View } from 'react-native';
import { useMutation } from 'react-query';
import Button from '../components/Button';
import Text from '../components/Text';
import * as api from '../api';
import { Formik } from 'formik';
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  mobile: Yup.string().min(10, '').max(10, '').required(''),
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
        mobile: formikRef.current.values.mobile,
      });
    }
  }, [isSuccess, isError]);

  const onSubmit = values => {
    mutate({
      mobile: values.mobile,
    });
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        mobile: '',
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
      }) => (
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingBottom: 18,
          }}>
          <View>
            <Text
              fontWeight={800}
              textStyle={{
                fontSize: 24,
              }}>
              Login
            </Text>
            <Text textStyle={{ marginTop: 8, color: '#666666' }}>
              We will send an sms with a verification code to this number
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                fontWeight={800}
                textStyle={{
                  fontSize: 24,
                }}>
                +91
              </Text>
              <TextInput
                style={{
                  fontSize: 24,
                  fontFamily: 'NunitoSans-ExtraBold',
                  width: '100%',
                  marginLeft: 8,
                }}
                placeholder="Enter number"
                maxLength={10}
                keyboardType="phone-pad"
                onChangeText={handleChange('mobile')}
                onBlur={handleBlur('mobile')}
                value={values.mobile}
                autoFocus
              />
            </View>
            {errors.mobile ? (
              <Text
                textStyle={{
                  color: 'red',
                }}>
                {errors.mobile}
              </Text>
            ) : null}
          </View>
          <Button
            loading={isLoading}
            disabled={!isValid}
            onPress={handleSubmit}>
            Get Otp
          </Button>
        </View>
      )}
    </Formik>
  );
};

export default SendOtp;
