

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
import { updateBasket, basketSelector } from '../store/slices/basketReducer';
import { BorderlessButton } from 'react-native-gesture-handler';
import { Language, changeLanguage } from '../translations/I18n';
import { useAppDispatch, useAppSelector } from '../store/store'
import { config, updateARcode } from '../store/slices/configReducer';
import { styles } from '../styles/styles';
import * as safe_Format from '../styles/safe_Format';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const ProductOrderScreen = ({ backPage, route }: any) => {
    backPage ? backPage = backPage : backPage = route.params.backPage
    const item = route.params.route
    const navigation = useNavigation()
    const dispatch = useAppDispatch();
    const [order, setOrder] = useState(item.QTY ? item.QTY : 1)
    const basketProduct = useAppSelector(basketSelector)
    const ConfigList = useAppSelector(config)
    const addBasket = async (order: any) => {
        if (!ConfigList.MB_LOGIN_GUID) {
            Alert.alert(Language.t('notiAlert.header'), Language.t('product.notLogin'), [
                { text: Language.t('alert.confirm'), onPress: () => navigation.navigate('Profile') }])
        } else {
            let dateTime = new Date()
            let addBasket = []
            let newItem = {
                ...item,
                QTY: order,
                KEY: item.KEY ? item.KEY : dateTime.getTime()
            }

            let itemEdit = item.KEY ?
                basketProduct.basketProduct.filter((filteritem: any) => { return filteritem.KEY != item.KEY })
                : basketProduct.basketProduct

            addBasket = [...itemEdit, newItem]
            let newBasket = newSortBasketList(addBasket)

            await dispatch(updateBasket(newBasket))
            if (route.params.backPageItem)
                navigation.navigate(backPage, { backPage: backPage, name: route.params.name, route: route.params.backPageItem })
            else
                navigation.navigate(backPage)
        }

    }
    const newSortBasketList = (BasketList: any) => {
        return Object.values(BasketList.reduce((acc: any, cur: any) => {
            if (acc[cur.SHWC_CODE]) {
                acc[cur.SHWC_CODE].QTY = Number(acc[cur.SHWC_CODE].QTY) + Number(cur.QTY)
            } else {
                acc[cur.SHWC_CODE] = { ...cur }
            }
            return acc;
        }, {}))


    }
    return (route.params.route &&
        (
            <View style={{ alignItems: 'flex-end' }}>
                <View style={{
                    width: deviceWidth,
                    height: deviceHeight,
                }}>
                    <ScrollView
                        style={{
                            width: deviceWidth,
                            height: deviceHeight * 0.8,
                            backgroundColor: '#fff',
                        }}
                    >
                        <View style={{}}>

                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: deviceHeight * 0.5
                                }}>
                                {item.IMAGE64 == "" ? <Image
                                    style={{
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowRadius: 2,
                                        height: deviceHeight * 0.4,
                                        width: deviceWidth * 0.8,
                                        resizeMode: 'contain',
                                        borderRadius: deviceWidth * 0.05,
                                    }}
                                    source={require('../img/newproduct.png')}
                                /> : <Image
                                    style={{
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowRadius: 2,
                                        height: deviceHeight * 0.4,
                                        width: deviceWidth * 0.8,
                                        resizeMode: 'contain',
                                        borderRadius: deviceWidth * 0.05,
                                    }}
                                    source={{ uri: `data:image/png;base64,${item.IMAGE64}` }}
                                />}
                            </View>
                            <View
                                style={{
                                    padding: deviceWidth * 0.1
                                }}>
                                <View
                                    style={{
                                        borderBottomWidth: 2,
                                        borderColor: Colors.borderColor
                                    }}
                                >
                                    <Text style={{
                                        fontFamily: 'Kanit-Bold',
                                        fontSize: FontSize.medium,
                                        color: Colors.headerColor

                                    }}>
                                        {Language.getLang() == 'th' ? item.SHWC_ALIAS : item.SHWC_EALIAS}
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'baseline'
                                        }}>

                                        <Text style={{
                                            fontFamily: 'Kanit-Bold',
                                            fontSize: FontSize.large,
                                            color: Colors.headerColor
                                        }}>
                                            {`${item.NORMARPLU_U_PRC == '' ? safe_Format.currencyFormat(0) : safe_Format.currencyFormat(item.NORMARPLU_U_PRC)} ${Language.t('product.thb')}.- `}
                                        </Text>
                                        <Text style={styles.textLight_title}>
                                            {Language.t('product.thb')}
                                        </Text>
                                    </View>
                                </View>
                                {item.SHWC_EDIT_FEATURE != '' && (
                                    <View
                                        style={{
                                            marginTop: deviceHeight * 0.01,
                                        }}>
                                        <Text
                                            style={styles.textBold}>
                                            {Language.t('product.productDetails')}
                                        </Text>
                                        <Text
                                            style={styles.textLight}>
                                            {item.SHWC_EDIT_FEATURE.split('EN:').length > 1 ? Language.getLang() == 'th' ? item.SHWC_EDIT_FEATURE.split('EN:')[0]
                                                : item.SHWC_EDIT_FEATURE.split('EN:')[1]
                                                : item.SHWC_EDIT_FEATURE.split('EN:')[0]}
                                        </Text>
                                    </View>
                                )}
                            </View>


                        </View>


                    </ScrollView>
                    <View style={{
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}>
                        <View style={{
                            width: deviceWidth,
                            height: deviceHeight * 0.1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',

                            backgroundColor: Colors.backgroundColor,
                        }}>

                            <TouchableOpacity
                                disabled={order > 1 ? false : true}
                                onPress={() => setOrder(order - 1)}
                            >
                                <View
                                    style={{
                                        width: deviceWidth * 0.1,
                                        height: deviceWidth * 0.1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: Colors.buttonTextColor,
                                        borderRadius: deviceWidth * 0.1,
                                    }}
                                >
                                    <Text style={{
                                        fontFamily: 'Kanit-Bold',
                                        fontSize: FontSize.large,
                                        color: order > 1 ? Colors.menuButton : Colors.borderColor
                                    }}
                                    >
                                        -
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginLeft: deviceWidth * 0.08,
                                    marginRight: deviceWidth * 0.08,
                                }}

                            >
                                <Text style={{
                                    fontFamily: 'Kanit-Light',
                                    fontSize: FontSize.large * 2,
                                    color: Colors.menuButton
                                }}
                                >
                                    {order}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setOrder(order + 1)}
                            >
                                <View
                                    style={{
                                        width: deviceWidth * 0.1,
                                        height: deviceWidth * 0.1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: Colors.buttonTextColor,
                                        borderRadius: deviceWidth * 0.1,
                                    }}
                                >
                                    <Text style={{
                                        fontFamily: 'Kanit-Bold',
                                        fontSize: FontSize.large,
                                        color: Colors.menuButton
                                    }}
                                    >
                                        +
                                    </Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                        <View style={styles.order}>

                            <TouchableOpacity
                                onPress={() => addBasket(order)}
                                style={styles.order_btn}
                            >
                                <View
                                    style={styles.order_view}
                                >
                                    <Text style={styles.order_text}>
                                        {`${Language.t('product.addToCart')} ${item.NORMARPLU_U_PRC == '' ? safe_Format.currencyFormat(0) : safe_Format.currencyFormat(item.NORMARPLU_U_PRC * order)} ${Language.t('product.thb')}`}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>

                </View>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.back_btn}
                >
                    <View style={styles.back_btn_view}>
                        <Text style={styles.back_text_title}>
                            x
                        </Text>
                    </View>
                </TouchableOpacity>

            </View>
        )
    )
}

export default ProductOrderScreen 