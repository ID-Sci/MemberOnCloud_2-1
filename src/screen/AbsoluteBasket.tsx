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
import { FontSize } from '../styles/FontSizeHelper';
import UnFlatListBasket from '../components/UnFlatListBasket';
import FlatListBasket from '../components/FlatListBasket';
import { useAppSelector } from '../store/store';
import { basketSelector } from '../store/slices/basketReducer';
import * as safe_Format from '../styles/safe_Format';
import { config, updateUserList, updateMB_LOGIN_GUID, clearUserList, updateLoginList, clearLoginList } from '../store/slices/configReducer';
 
import { Language } from '../translations/I18n';

import { styles,statusBarHeight, deviceWidth,deviceHeight} from '../styles/styles';

const AbsoluteBasket = ({ route }: any) => {
    const navigation = useNavigation();
    const basketProduct = useAppSelector(basketSelector)
    const ConfigList = useAppSelector(config)
    return ( 
        (
            <TouchableOpacity style={{
                position: 'absolute',
                bottom: 20,
                right: 20,


                borderRadius: FontSize.large * 2,
                elevation: 4,
            }}
                onPress={() => navigation.navigate('basket' as never)}
            >
                <View    >
           
                    <Image
                        source={require('../img/iconsMenu/shopping.png')}
                        style={{
                            width: FontSize.large * 2,
                            height: FontSize.large * 2,
                            resizeMode: 'contain',
                        }}
                    />
                </View>
                {basketProduct.basketProduct.length > 0 && (
                    <View
                        style={{
                            right: -3,
                            top: -2,
                            backgroundColor: 'red',
                            borderRadius: FontSize.large,
                            width: FontSize.large,
                            height: FontSize.large,
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: FontSize.medium, fontWeight: 'bold' }}>
                            {basketProduct.basketProduct.length}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>)
    )
}

export default AbsoluteBasket 