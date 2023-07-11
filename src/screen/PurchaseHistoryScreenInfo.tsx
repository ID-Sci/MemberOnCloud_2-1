import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TextInput,
    Modal,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Feather from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

import { FontSize } from '../styles/FontSizeHelper';
import { config, updateUserList, clearUserList, updateLoginList, clearLoginList } from '../store/slices/configReducer';
import Colors from '../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/store';
import * as safe_Format from '../styles/safe_Format';
import { newproductSelector } from '../store/slices/newproductReducer';
import * as Keychain from 'react-native-keychain';
import { Language, changeLanguage } from '../translations/I18n';
import { styles } from '../styles/styles';
import CurrencyInput from 'react-native-currency-input';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const PurchaseHistoryScreenInfo = ({ route }: any) => {
    const newproductList = useAppSelector(newproductSelector)
    const ConfigList = useAppSelector(config)
    const navigation = useNavigation()

    const [Oe, setOe] = useState({});

    const [product, setProduct] = useState(newproductList.allproductList)

    useEffect(() => {
        route.params.route && (
            console.log(route.params.route),
            setOe(route.params.route)
        )
    }, []);

    return (route.params.route && (
        <View
            style={{
                backgroundColor: '#fff',
                width: deviceWidth,
                height: deviceHeight
            }}
        >
            <View style={styles.header}>
                <Text
                    style={styles.header_text_title}>
                    {Oe.DOCINFO && Oe.DOCINFO.DI_REF}
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
            < View>
                <ScrollView
                    style={{
                        width: deviceWidth,
                    }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={styles.obj_list}>
                        {
                            Oe.TRANSTKD && Oe.TRANSTKD.map((item, index) => {
                                return (
                                    <>
                                        <View style={{
                                            padding: 10,
                                            width: deviceWidth - 40,
                                            alignItems: 'center',
                                            borderColor: Colors.borderColor,
                                            borderBottomWidth: 1
                                        }}>
                                            <View style={{
                                                width: deviceWidth - 40,
                                                backgroundColor: '#fff', alignItems: 'center',
                                                justifyContent: 'center',
                                            }} >

                                                <View
                                                    style={{
                                                        width: deviceWidth * 0.8,
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        flexDirection: 'row',
                                                    }}>
                                                    <View style={{
                                                        alignItems: 'flex-start',
                                                        justifyContent: 'center',
                                                        width: deviceWidth * 0.2,
                                                        height: deviceWidth * 0.2,
                                                    }}>
                                                        {product && !product.find(obj => obj.GOODS_CODE == item.GOODS_CODE)?.IMAGE64 || product.find(obj => obj.GOODS_CODE == item.GOODS_CODE)?.IMAGE64 == "" ? <Image
                                                            style={{
                                                                resizeMode: 'contain',
                                                                height: deviceWidth * 0.15,
                                                                width: deviceWidth * 0.15,
                                                            }}
                                                            source={require('../img/newproduct.png')}
                                                        /> : <Image
                                                            style={{
                                                                resizeMode: 'contain',
                                                                height: deviceWidth * 0.15,
                                                                width: deviceWidth * 0.15,
                                                            }}
                                                            source={{ uri: `data:image/png;base64,${product.find(obj => obj.GOODS_CODE == item.GOODS_CODE).IMAGE64}` }}
                                                        />}
                                                    </View>
                                                    <View style={{
                                                        width: deviceWidth * 0.6,
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        flexDirection: 'row',
                                                    }}>
                                                        <View>
                                                            <View style={{
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                width: deviceWidth * 0.6,
                                                                flexDirection: 'row',
                                                            }}>
                                                                <Text style={styles.textLight}>
                                                                    {Language.getLang() == 'th' ? product.find(obj => obj.GOODS_CODE == item.GOODS_CODE)?.SHWC_ALIAS : product.find(obj => obj.GOODS_CODE == item.GOODS_CODE)?.SHWC_EALIAS}
                                                                </Text>
                                                            </View>
                                                            <View style={{
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                width: deviceWidth * 0.6,
                                                                height: FontSize.large * 2,
                                                                flexDirection: 'row',
                                                            }}>
                                                                <Text style={styles.textLight}>
                                                                    X  {item.TRD_QTY}
                                                                </Text>
                                                                <CurrencyInput
                                                                    editable={false}
                                                                    delimiter=","
                                                                    separator="."
                                                                    precision={2}
                                                                    color={Colors.fontColor}
                                                                    fontFamily={'Kanit-Light'}
                                                                    placeholderTextColor={Colors.fontColor}
                                                                    value={item.TRD_K_U_PRC == '' ? 0 : item.TRD_K_U_PRC * item.TRD_QTY}
                                                                    multiline={true}
                                                                    textAlign={'center'}
                                                                />

                                                            </View>

                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </>)
                            })}
                        <View style={{
                            height: FontSize.large * 2,
                            alignSelf: 'center',
                        }}>
                            <View
                                style={{

                                    width: deviceWidth - 40,
                                    alignItems: 'center',

                                    flexDirection: 'row',
                                }}>
                                <View
                                    style={{
                                        width: (deviceWidth - 40) / 2,
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <Text style={styles.textLight} >
                                        X {Oe.TRANSTKD && Oe.TRANSTKD.map(obj => Number(obj.TRD_QTY))
                                            .reduce((accumulator, currentValue) => accumulator + currentValue, 0)} ชิ้น
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        width: (deviceWidth - 40) / 2,
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <Text style={styles.textLight} >
                                    {Language.t('history.orderList')}: ฿{safe_Format.formatCurrency(Oe.TRANSTKD && Oe.TRANSTKD.TRD_K_U_PRC == '' ? 0 : Oe.TRANSTKD && Oe.TRANSTKD.map(obj => Number(obj.TRD_K_U_PRC * obj.TRD_QTY))
                                            .reduce((accumulator, currentValue) => accumulator + currentValue, 0))}
                                    </Text>
                                  
                                    
                                </View>

                            </View>
                        </View>
                    </View>


                </ScrollView>

            </View >

        </View>
    ))

}

export default PurchaseHistoryScreenInfo 