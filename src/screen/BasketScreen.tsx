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
import { styles } from '../styles/styles';
import { Language } from '../translations/I18n';

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

                    style={styles.header}>
                    <Text style={styles.header_text_title}>
                        {Language.t('product.myBasket')}
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.header_text_Xtitle}>
                            x
                        </Text>
                    </TouchableOpacity>
                </View>
                {ConfigList.MB_LOGIN_GUID ?
                    <FlatListBasket items={basketProduct.basketProduct} itemsERP={basketProduct.basketProductERP} prepareDocument={basketProduct.prepareDocument} /> :
                    <UnFlatListBasket route={{}} />}
            </View>)
    )
}

export default BasketScreen 