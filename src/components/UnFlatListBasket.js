import React, { useState, useEffect } from 'react';

import {
    ScrollView,
    Dimensions,
    Text,
    Image,
    TouchableOpacity,
    View,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../styles/colors';
import { FontSize } from '../styles/FontSizeHelper';
import CurrencyInput from 'react-native-currency-input';
import { useAppDispatch, useAppSelector } from '../store/store'
import { updateBasket, updatePrepareDocumentt } from '../store/slices/basketReducer';
import * as Keychain from 'react-native-keychain';
import { config, updateARcode } from '../store/slices/configReducer';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default FlatListBasket = ({ route }) => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();

    return (
        <>
         <View style={{
                    backgroundColor: Colors.backgroundColor,
                    padding: deviceWidth * 0.1
                }} >
                    
                    <View
                        style={{
                            flexDirection: 'column',
                        }}>
                        <View>
                        <Image
                            style={{
                                width: undefined,
                                height: deviceWidth / 1.5,
                                resizeMode: 'contain',
                            }}
                            resizeMode={'contain'}
                            source={require('../img/empty-box-blue-icon.png')}
                        />
                            <Text style={{ alignSelf: 'center' }}>
                               กรุณาเข้าสู่ระบบเพื่อเพิ่มรายการสินค้า
                            </Text>
                        </View>
                         
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Profile')}
                            style={{

                                padding: deviceWidth * 0.025,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <View
                                style={{

                                    width: deviceWidth * 0.7,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    backgroundColor: Colors.menuButton,
                                    height: deviceHeight * 0.07,
                                    borderRadius: deviceWidth * 0.1,
                                }}

                            >
                                <Text style={{
                                    fontSize: FontSize.large,
                                    color: Colors.buttonTextColor
                                }}
                                >

                                    {`เข้าสู่ระบบ`}


                                </Text>
                            </View>
                        </TouchableOpacity>
                     
                    </View>


                </View>
        </>

    )

}



