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
import { config, updateUserList, updateMB_LOGIN_GUID, clearUserList, updateLoginList, clearLoginList } from '../store/slices/configReducer';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const BasketScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const basketProduct = useAppSelector(basketSelector)
    const ConfigList = useAppSelector(config)
    return (basketProduct &&
        (
            <View
                style={{
                    width: deviceWidth,
                    height: deviceHeight
                }}
            >

                <View

                    style={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        width: deviceWidth,
                        padding: deviceHeight * 0.02,
                        backgroundColor: Colors.backgroundLoginColorSecondary,
                        borderBottomWidth: 1,
                        borderColor: Colors.borderColor
                    }}>
                    <Text
                        style={{
                            fontSize: FontSize.medium,
                            color: Colors.menuButton,
                            fontWeight: 'bold',
                        }}>
                        ตะกร้าของฉัน
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={{
                            fontSize: FontSize.large,
                        }}
                        >
                            x
                        </Text>
                    </TouchableOpacity>
                </View>
                {ConfigList.MB_LOGIN_GUID?
                <FlatListBasket items={basketProduct.basketProduct} itemsERP={basketProduct.basketProductERP} prepareDocument={basketProduct.prepareDocument} />:
                <UnFlatListBasket route={{}} />}
              
            </View>)
    )
}

export default BasketScreen 