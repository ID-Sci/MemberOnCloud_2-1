import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TextInput,
    Modal,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    RefreshControl,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Feather from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

import { FontSize } from '../styles/FontSizeHelper';
import { config, updateUserOe, clearUserList, updateLoginList, clearLoginList } from '../store/slices/configReducer';
import Colors from '../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/store';
import * as safe_Format from '../styles/safe_Format';
import { newproductSelector } from '../store/slices/newproductReducer';
import * as Keychain from 'react-native-keychain';
import CurrencyInput from 'react-native-currency-input';
import { Language, changeLanguage } from '../translations/I18n';
import { styles, statusBarHeight, deviceWidth, deviceHeight } from '../styles/styles';
import FlatSlider from '../components/FlatListSlider';
import DSDocInfo from '../components/DSDocInfo';
import BKDocInfo from '../components/BKDocInfo';
const PurchaseHistoryScreen = () => {
    const ConfigList = useAppSelector(config)
    const navigation = useNavigation()
 
    const [DocType, setDocType] = useState('SELL');

console.log(JSON.stringify(ConfigList.UserList))

    return (
        <View
            style={{
                backgroundColor: '#fff',
                width: deviceWidth,
                height: deviceHeight+statusBarHeight
            }}
        >
            <View style={styles.header}>
                <Text
                    style={styles.header_text_title}>
                    {Language.t('profileCard.viewOrderHistory')}
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.header_text_Xtitle}
                    >
                        x
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: deviceWidth,
                backgroundColor: Colors.backgroundColor,
                borderBottomWidth: 1,
                borderColor: Colors.borderColor
            }}>
                <TouchableOpacity
                    onPress={() => setDocType('SELL')}
                >
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: deviceWidth / 2,
                        paddingLeft: FontSize.large,
                        paddingRight: FontSize.large,
                        height: FontSize.large * 2,
                        backgroundColor: DocType == 'SELL' ? Colors.backgroundColorSecondary : Colors.backgroundColor,
                    }}>
                        <Text style={{
                            color: DocType == 'SELL' ? Colors.darkPrimiryColor : Colors.fontColor,
                            fontFamily: 'Kanit-Bold',
                            textAlign: 'center'
                        }}>
                        {Language.t('profileCard.purchaseList')} 
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setDocType('BOOKING')}
                >
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: deviceWidth / 2,
                        paddingLeft: FontSize.large,
                        paddingRight: FontSize.large,
                        height: FontSize.large * 2,
                        backgroundColor: DocType == 'BOOKING' ? Colors.backgroundColorSecondary : Colors.backgroundColor,
                    }}>
                        <Text style={{
                            color: DocType == 'BOOKING' ? Colors.darkPrimiryColor : Colors.fontColor,
                            fontFamily: 'Kanit-Bold',
                            textAlign: 'center'
                        }}>
                             {Language.t('profileCard.productOrders')} 
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <>
                {DocType == 'SELL' && ConfigList.UserList.AR_CODE && <DSDocInfo AR_CODE={ConfigList.UserList.AR_CODE} />}
                {DocType == 'BOOKING' && ConfigList.UserList.AR_CODE && <BKDocInfo AR_CODE={ConfigList.UserList.AR_CODE} />}
            </>

        </View>
    )

}

export default PurchaseHistoryScreen 