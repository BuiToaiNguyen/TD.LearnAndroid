/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {StyleSheet, Platform,SafeAreaView } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import AppStack from './AppStack';
import {Host} from 'react-native-portalize';

const RootContainerScreen = () => {
  return (
    <NavigationContainer>
      <Host>
        <SafeAreaView style={{flex:1}}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen
            name="AppStack"
            component={AppStack}
            options={{
              animationEnabled: false,
            }}
          />
        </Stack.Navigator>
        </SafeAreaView>
      </Host>
    </NavigationContainer>
  );
};

export default RootContainerScreen;

const styles = StyleSheet.create({});
