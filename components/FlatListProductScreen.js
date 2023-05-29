

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
import Colors from '../src/styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontSize } from '../src/styles/FontSizeHelper';
import CurrencyInput from 'react-native-currency-input';

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
                <View style={{
                    alignItems: 'center',
                    paddingLeft: deviceWidth * 0.05,
                    paddingRight: deviceWidth * 0.05,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}>
                    {route.map((item, index) => {
                        return (index < 10 &&
                            <>
                                <View style={{ padding: deviceWidth * 0.01, }}>
                                    <TouchableOpacity style={{
                                        backgroundColor: '#fff', alignItems: 'center',
                                        justifyContent: 'center',
                                        width: deviceWidth * 0.42,
                                        borderRadius: deviceWidth * 0.05,
                                    }}
                                        onPress={() => navigation.navigate('ProductOrder', { route: item })}>
                                        <View
                                            style={{
                                                height: deviceHeight * 0.2
                                            }}>
                                            {item.IMAGE64 == "" ? <Image
                                                style={{
                                                    shadowColor: '#000',
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.8,
                                                    shadowRadius: 2,
                                                    height: deviceWidth * 0.2,
                                                    width: deviceWidth * 0.3,
                                                    resizeMode: 'contain',
                                                }}
                                                source={require('../img/newproduct.png')}
                                            /> : <Image
                                                style={{
                                                    shadowColor: '#000',
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.8,
                                                    shadowRadius: 2,
                                                    height: deviceHeight * 0.2,
                                                    width: deviceWidth * 0.3,
                                                    resizeMode: 'contain',
                                                }}
                                                source={{ uri: `data:image/png;base64,${item.IMAGE64}` }}
                                            />}
                                        </View>
                                        <View
                                            style={{

                                            }}>
                                            <Text style={{
                                                textAlign: 'center'
                                            }}>
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
                                                    placeholderTextColor={Colors.fontColor}
                                                    value={item.NORMARPLU_U_PRC == '' ? 0 : item.NORMARPLU_U_PRC}
                                                    multiline={true}
                                                    textAlign={'center'}
                                                />
                                                <Text
                                                    style={{
                                                        color: 'red',
                                                        fontSize: FontSize.medium
                                                    }}
                                                >
                                                    {`. - `}
                                                </Text>
                                                <Text
                                                    style={{
                                                        color: Colors.fontColor,
                                                        fontSize: FontSize.medium
                                                    }}
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

