

import React, { useState, useEffect } from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
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
import { Language, changeLanguage } from '../translations/I18n';
import * as safe_Format from '../styles/safe_Format';
import { styles } from '../styles/styles';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default FlatListProductScreen = ({ backPage, name, route }) => {
    console.log(backPage)
    const navigation = useNavigation();
    return (route &&
        (
            <ScrollView
                style={{
                    width: deviceWidth,
                }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <View style={styles.obj_list}>
                    {route.map((item, index) => {
                        return (
                            <>
                                <View style={{ padding: deviceWidth * 0.01, }}>
                                    <TouchableOpacity style={styles.product_bottom_shadow}
                                        onPress={() => navigation.navigate('ProductOrder', { backPage: backPage, name: name, backPageItem: route, route: item })}>
                                        <View
                                            style={{
                                                height: deviceHeight * 0.2,
                                                justifyContent:'center',
                                                alignItems:'center'
                                            }}>
                                            {item.IMAGE64 == "" ? <Image
                                                style={styles.obj_Noimage}
                                                source={require('../img/newproduct.png')}
                                            /> : <Image
                                                style={styles.obj_image}
                                                source={{ uri: `data:image/png;base64,${item.IMAGE64}` }}
                                            />}
                                        </View>
                                        <View style={{ padding: 10 }}>
                                            <Text style={styles.textLight_title} >
                                                {Language.getLang() == 'th' ? item.SHWC_ALIAS : item.SHWC_EALIAS}
                                            </Text>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>

                                                <Text
                                                    style={{
                                                        color: 'red',
                                                        fontFamily: 'Kanit-Light',
                                                        fontSize: FontSize.medium
                                                    }}
                                                >
                                                    {`${item.NORMARPLU_U_PRC == '' || item.NORMARPLU_U_PRC == '-' ? safe_Format.currencyFormat(0) : safe_Format.currencyFormat(item.NORMARPLU_U_PRC)} .- `}
                                                </Text>
                                                <Text
                                                    style={styles.textLight_title}
                                                >
                                                    {item.UTQ_NAME}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )
                    })}


                </View>
            </ScrollView>
            )
    )
}

