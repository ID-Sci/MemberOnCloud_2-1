

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
import { styles } from '../styles/styles';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default FlatListProductScreen = ({ route }) => {
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
                        return (index < 10 &&
                            <>
                                <View style={{ padding: deviceWidth * 0.01, }}>
                                    <TouchableOpacity style={styles.product_bottom_shadow}
                                        onPress={() => navigation.navigate('ProductOrder', { route: item })}>
                                        <View
                                            style={{
                                                height: deviceHeight * 0.2
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
                                                    fontFamily={"Kanit-Light"}
                                                    fontSize={FontSize.medium}
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
            </ScrollView>)
    )
}

