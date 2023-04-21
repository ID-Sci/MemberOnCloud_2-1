/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
// import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  Image
} from 'react-native';
import { Provider } from 'react-redux';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screen/HomeScreen'
import SpaceScreen from './screen/SpaceScreen'
import BasketScreen from './screen/BasketScreen'
import ProductScreen from './screen/ProductScreen'
import ProductCategoryScreen from './screen/ProductCategoryScreen'
import ProductSearchScreen from './screen/ProductSearchScreen'

import ProductOrderScreen from './screen/ProductOrderScreen'
import LoginScreen from './screen/LoginScreen'
import RegisterScreen from './screen/RegisterScreen'
import UpdateScreen from './screen/UpdateScreen'
import FoegetScreen from './screen/FoegetScreen'

import Scanbarcode from './screen/Scanbarcode'
import HistoryScreen from './screen/HistoryScreen'

import ShowTemppageScreen from './screen/ShowTemppageScreen'
import TemppageScreen from './screen/TemppageScreen'
import MyCardScreen from './screen/MyCardScreen'
import ProfileScreen from './screen/ProfileScreen'


import { store } from './src/store/store';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const Navigator = () => {
  const MainStack = createNativeStackNavigator();

  const MainNavigator = () => {
    return (
      <MainStack.Navigator initialRouteName={'Space'}>
        <MainStack.Screen
          options={{ headerShown: false }}
          name="Space"
          component={SpaceScreen}
        />
        <MainStack.Screen
          options={{ headerShown: false }}
          name="bstab"
          component={Maintabs}
        />
        <MainStack.Screen
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
          name="Newproduct"
          component={ProductScreen}
        />
        <MainStack.Screen
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
          name="ProductCategory"
          component={ProductCategoryScreen}
        />
        <MainStack.Screen
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
          name="ProductSearch"
          component={ProductSearchScreen}
        />

        <MainStack.Screen
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
          name="ProductOrder"
          component={ProductOrderScreen}
        />
        <MainStack.Screen
          options={{ headerShown: false, }}
          name="Login"
          component={LoginScreen}
        />
        <MainStack.Screen
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
          name="Register"
          component={RegisterScreen}
        />
        <MainStack.Screen
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
          name="Updateuser"
          component={UpdateScreen}
        />

        <MainStack.Screen
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
          name="Foeget"
          component={FoegetScreen}
        />

        <MainStack.Screen
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
          name="Scanner"
          component={Scanbarcode}
        />
        <MainStack.Screen
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
          name="History"
          component={HistoryScreen}
        />

        <MainStack.Screen
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
          name="ShowTemppage"
          component={ShowTemppageScreen}
        />
        <MainStack.Screen
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
          name="Temppage"
          component={TemppageScreen}
        />
        <MainStack.Screen
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
          name="MyCard"
          component={MyCardScreen}
        />

      </MainStack.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>

  )
}

// 

const App = (): JSX.Element => {

  return (
    <Provider store={store}>
      <StatusBar hidden={true} />
      <Navigator />
    </Provider>

  );
}

const BottomTabs = createBottomTabNavigator();
const Maintabs = () => (

  <BottomTabs.Navigator

    screenOptions={({ route }: any) => ({
      tabBarShowLabel: false,
      tabBarIcon: ({ focused }: any) => {
        if (route.name === 'Home') {
          return (
            <Image
              source={
                focused
                  ? require('./img/iconsMenu/home.png')
                  : require('./img/iconsMenu/home-b.png')
              }
              style={{
                width: deviceWidth * 0.075,
                height: deviceWidth * 0.075,
              }}
            />
          );
        } else if (route.name === 'basket') {
          return (
            <Image
              source={
                focused
                  ? require('./img/iconsMenu/shopping.png')
                  : require('./img/iconsMenu/shopping-b.png')
              }
              style={{
                width: deviceWidth * 0.075,
                height: deviceWidth * 0.075,
              }}
            />
          );
        } else if (route.name === 'Profile') {
          return (
            <Image
              source={
                focused
                  ? require('./img/iconsMenu/user.png')
                  : require('./img/iconsMenu/user-b.png')
              }
              style={{
                width: deviceWidth * 0.075,
                height: deviceWidth * 0.075,
              }}
            />
          );
        }
      }
    })}
  >
    <BottomTabs.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
    <BottomTabs.Screen options={{ headerShown: false }} name="basket" component={BasketScreen} />
    <BottomTabs.Screen options={{ headerShown: false }} name="Profile" component={ProfileScreen} />
  </BottomTabs.Navigator>
);


// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;
