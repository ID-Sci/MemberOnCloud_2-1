

import React, { useState, useEffect } from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    FlatList,
    Dimensions,
    Text,
    BackHandler,
    Image,
    Alert,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontSize } from '../styles/FontSizeHelper';
import CurrencyInput from 'react-native-currency-input';
import FlatListPromotion from '../components/FlatListPromotion';
import { BorderlessButton } from 'react-native-gesture-handler';
import { config, } from '../store/slices/configReducer';
import { useAppDispatch, useAppSelector } from '../store/store';
import LoginScreen from './LoginScreen'
import MyCardScreen from './MyCardScreen'
import { styles,statusBarHeight, deviceWidth,deviceHeight} from '../styles/styles';

const ProfileScreen = ( ) => {
    const navigation = useNavigation()
    const [order, setOrder] = useState(1) 
    const ConfigList = useAppSelector(config)
    console.log()
    console.log(`\nMycardList.UserList > ${ConfigList.MB_LOGIN_GUID}`)
    return (ConfigList.MB_LOGIN_GUID == '' ? <LoginScreen /> :
        <MyCardScreen />
    )
}

export default ProfileScreen 