import React, { useEffect, useRef } from 'react';
import { TextInput, View } from 'react-native';
import { useMutation, useQueryClient } from 'react-query';
import Button from '../components/Button';
import Text from '../components/Text';
import * as api from '../api';
import { Formik } from 'formik';
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  name: Yup.string('').min(1, '').max(50, '').required(''),
});

const Onboard = ({ navigation }) => {
  const formikRef = useRef();

  const queryClient = useQueryClient();
  const { mutate, isLoading, isError, error, isSuccess } = useMutation(
    'editProfile',
    api.editProfile,
    {
      onSuccess: newData => {
        queryClient.setQueryData('getProfile', newData);
      },
    },
  );

  useEffect(() => {
    if (isError) {
      formikRef.current.setFieldError(error?.error?.key, error?.error?.message);
    }
  }, [isError]);

  const onSubmit = values => {
    mutate({
      name: values.name,
    });
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        name: '',
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
            paddingVertical: 24,
          }}>
          <View>
            <Text
              fontWeight={700}
              textStyle={{
                fontSize: 24,
              }}>
              What's your full name?
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
                placeholder="Full name"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                autoFocus
              />
            </View>
            {touched.name && errors.name ? (
              <Text
                textStyle={{
                  color: 'red',
                }}>
                {errors.name}
              </Text>
            ) : null}
          </View>
          <Button
            loading={isLoading}
            disabled={!isValid}
            onPress={handleSubmit}>
            Submit
          </Button>
        </View>
      )}
    </Formik>
  );
};

export default Onboard;
