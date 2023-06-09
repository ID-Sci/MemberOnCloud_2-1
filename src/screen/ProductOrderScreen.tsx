

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
import { useAppDispatch, useAppSelector } from '../store/store'
import { config, updateARcode } from '../store/slices/configReducer';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const ProductOrderScreen = ({ route }: any) => {
    const item = route.params.route
    const navigation = useNavigation()
    const dispatch = useAppDispatch();
    const [order, setOrder] = useState(item.QTY ? item.QTY : 1)
    const basketProduct = useAppSelector(basketSelector)
    const ConfigList = useAppSelector(config)
    const addBasket = async (order: any) => {
        if (!ConfigList.MB_LOGIN_GUID) {
            Alert.alert(`แจ้งเตือน`, `กรุณาเข้าสู่ระบบเพื่อเพิ่มรายการสินค้า`, [
                { text: `ยืนยัน`, onPress: () => navigation.navigate('Profile') }])
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
            navigation.navigate("basket")
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
                                        fontSize: FontSize.medium,
                                        fontWeight: 'bold',
                                        color: Colors.headerColor

                                    }}>
                                        {item.SHWC_ALIAS}
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                        <CurrencyInput
                                            editable={false}
                                            delimiter=","
                                            separator="."
                                            precision={2}
                                            color={Colors.headerColor}
                                            fontSize={FontSize.large}
                                            fontWeight={'bold'}
                                            placeholderTextColor={Colors.fontColor}
                                            value={item.NORMARPLU_U_PRC == '' ? 0 : item.NORMARPLU_U_PRC}
                                            multiline={true}
                                            textAlign={'center'}
                                        />

                                        <Text
                                            style={{
                                                color: Colors.fontColor,
                                                fontWeight: 'bold',
                                                fontSize: FontSize.medium
                                            }}
                                        >
                                            {`บาท`}
                                        </Text>
                                    </View>
                                </View>
                                {item.SHWC_EDIT_FEATURE != '' && (
                                    <View
                                        style={{
                                            borderBottomWidth: 2,
                                            marginTop: deviceHeight * 0.01,
                                            borderColor: Colors.borderColor
                                        }}>
                                        <Text
                                            style={{
                                                color: Colors.fontColor,
                                                fontSize: FontSize.medium
                                            }}>
                                            {`รายละเอียดสินค้า`}
                                        </Text>
                                        <Text
                                            style={{
                                                color: Colors.fontColor,
                                                fontSize: FontSize.medium
                                            }}>
                                            {item.SHWC_EDIT_FEATURE}
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
                                style={{


                                }}
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
                                    fontSize: FontSize.large * 2,
                                    color: Colors.menuButton
                                }}
                                >
                                    {order}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setOrder(order + 1)}
                                style={{


                                }}
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
                                        fontSize: FontSize.large,
                                        color: Colors.menuButton
                                    }}
                                    >
                                        +
                                    </Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                        <View style={{
                            width: deviceWidth,
                            height: deviceHeight * 0.1,
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            backgroundColor: Colors.backgroundColor,
                        }}>

                            <TouchableOpacity
                                onPress={() => addBasket(order)}
                                style={{

                                    padding: deviceWidth * 0.025,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <View
                                    style={{

                                        width: deviceWidth * 0.9,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        backgroundColor: Colors.menuButton,
                                        height: deviceHeight * 0.07,
                                        borderRadius: 10,
                                    }}

                                >
                                    <Text style={{
                                        fontSize: FontSize.medium,
                                        color: Colors.buttonTextColor
                                    }}
                                    >

                                        {`ใส่ตะกร้า `}
                                    </Text>
                                    <CurrencyInput
                                        editable={false}
                                        delimiter=","
                                        separator="."
                                        precision={2}
                                        color={Colors.buttonTextColor}
                                        fontSize={FontSize.medium}
                                        fontWeight={'bold'}
                                        placeholderTextColor={Colors.fontColor}
                                        value={item.NORMARPLU_U_PRC == '' ? 0 : item.NORMARPLU_U_PRC * order}
                                        multiline={true}
                                        textAlign={'center'}
                                    />
                                    <Text style={{
                                        fontSize: FontSize.medium,
                                        color: Colors.buttonTextColor
                                    }}
                                    >

                                        {` บาท`}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>

                </View>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{

                        padding: deviceWidth * 0.025,
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                    }}
                >
                    <View
                        style={{
                            height: deviceWidth * 0.1,
                            width: deviceWidth * 0.1,
                            alignItems: 'center',
                            backgroundColor: '#fff',

                            borderRadius: deviceWidth * 0.1,
                        }}

                    >
                        <Text style={{
                            fontSize: FontSize.large,
                            color: Colors.fontColor
                        }}
                        >
                            x
                        </Text>
                    </View>
                </TouchableOpacity>

            </View>
        )
    )
}

export default ProductOrderScreen 