

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
    ActivityIndicator,
    Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontSize } from '../styles/FontSizeHelper';
import * as Keychain from 'react-native-keychain';
import { useAppSelector } from '../store/store';
import { basketSelector } from '../store/slices/basketReducer';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const IconBasketTab = (focused: any) => {
    const basketProduct = useAppSelector(basketSelector)
    const [configToken, setconfigToken] = useState(null)
    useEffect(() => {
        getVersionData()
    })
    const getVersionData = async () => {
        const checkLoginToken = await Keychain.getGenericPassword();
        setconfigToken(JSON.parse(checkLoginToken.password))

    }
    return (
        <View style={{ width: 24, height: 24, margin: 5 }}>
            <Image
                source={
                    focused.focused
                        ? require('../img/iconsMenu/shopping.png')
                        : require('../img/iconsMenu/shopping-b.png')
                }
                style={{
                    width: deviceWidth * 0.075,
                    height: deviceWidth * 0.075,
                }}
            />
            {configToken && configToken.logined == 'true' && basketProduct.basketProduct.length > 0 && (
                <View
                    style={{
                        position: 'absolute',
                        right: -6,
                        top: -3,
                        backgroundColor: 'red',
                        borderRadius: 6,
                        width: 12,
                        height: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                        {basketProduct.basketProduct.length}
                    </Text>
                </View>
            )}
        </View>
    );
};
export default IconBasketTab