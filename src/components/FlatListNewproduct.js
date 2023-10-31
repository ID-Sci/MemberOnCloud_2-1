

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
import { styles,statusBarHeight, deviceWidth,deviceHeight} from '../styles/styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontSize } from '../styles/FontSizeHelper';
import CurrencyInput from 'react-native-currency-input';
import * as safe_Format from '../styles/safe_Format';
import { Language, changeLanguage } from '../translations/I18n';
 
export default FlatListNewproduct = ({backPage, route }) => { 
    const navigation = useNavigation();
    return (route &&
        (
            <View
            >
                <View style={styles.menu_background}>
                    <Text style={styles.menu_text_title}>
                        {Language.t('product.newProduct')}
                    </Text>
                    <TouchableOpacity
                        style={styles.menu_btn}
                        onPress={() => navigation.navigate('Newproduct', { backPage:'Newproduct', name: Language.t('product.newProduct'), route: route })}
                    >
                        <Text style={styles.menu_text_title}>
                            {Language.t('product.seeMore')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    horizontal={true}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                 
                >
                    {route.map((item, index) => {

                        return (index < 10 &&
                            <>
                                <View style={{paddingRight: 10,paddingBottom:10 }}>
                                    <TouchableOpacity style={styles.newproduct_bottom_shadow}
                                        onPress={() => navigation.navigate('ProductOrder', {  backPage: backPage, route: item })}>
                                        {item.IMAGE64 == "" ? <Image
                                            style={styles.product_Noimage}
                                            source={require('../img/newproduct.png')}
                                        /> : <Image
                                            style={styles.product_image}
                                            source={{ uri: `data:image/png;base64,${item.IMAGE64}` }}
                                        />}
                                        <View style={{ padding: 10 }}>
                                            <Text style={styles.product_bottom_text_title}>
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
                                                   ฿{safe_Format.formatCurrency(item.NORMARPLU_U_PRC == '' ? 0 : item.NORMARPLU_U_PRC)}{`. - `}
                                                </Text>
                                                <Text
                                                    style={styles.product_bottom_text_title}
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

                </ScrollView>
          
            </View>)
    )
}

