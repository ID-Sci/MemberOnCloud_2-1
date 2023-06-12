

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
import { styles } from '../styles/styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontSize } from '../styles/FontSizeHelper';
import CurrencyInput from 'react-native-currency-input';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default FlatListNewproduct = ({ route }) => {
    const navigation = useNavigation();
    return (route &&
        (
            <View
            >
                <View style={styles.menu_background}>
                    <Text style={styles.menu_text_title}>
                        สินค้าใหม่
                    </Text>
                    <TouchableOpacity
                        style={styles.menu_btn}
                        onPress={() => navigation.navigate('Newproduct', { name: 'สินค้าใหม่', route: route })}
                    >
                        <Text style={styles.menu_text_title}>
                            ดูเพิ่มเติม
                        </Text>
                    </TouchableOpacity>

                </View>
                <ScrollView
                    paddingBottom={deviceWidth * 0.05}
                    horizontal={true}
                    height={deviceHeight * 0.4}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    {route.map((item, index) => {
                        return (index < 10 &&
                            <>
                                <View style={{ paddingLeft: deviceWidth * 0.01, paddingRight: deviceWidth * 0.01 }}>
                                    <TouchableOpacity style={styles.newproduct_bottom_shadow}
                                        onPress={() => navigation.navigate('ProductOrder', { route: item })}>

                                        {item.IMAGE64 == "" ? <Image
                                            style={styles.product_Noimage}
                                            source={require('../img/newproduct.png')}
                                        /> : <Image
                                        style={styles.product_image}
                                            source={{ uri: `data:image/png;base64,${item.IMAGE64}` }}
                                        />}
                                        <View style={{ padding: 10 }}>
                                            <Text style={styles.product_bottom_text_title}>
                                                {item.SHWC_ALIAS}
                                            </Text>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                <CurrencyInput
                                                    editable={false}
                                                    delimiter=","
                                                    separator="."
                                                    precision={2}
                                                    color={'red'}
                                                    fontSize={FontSize.medium}
                                                    fontFamily={'Kanit-Light'}
                                                    placeholderTextColor={Colors.fontColor} 
                                                    value={item.NORMARPLU_U_PRC == '' ? 0 : item.NORMARPLU_U_PRC}
                                                    multiline={true}
                                                    textAlign={'center'}
                                                />
                                                <Text
                                                    style={{
                                                        color: 'red',
                                                        fontFamily:'Kanit-Light',
                                                        fontSize: FontSize.medium
                                                    }}
                                                >
                                                    {`. - `}
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

