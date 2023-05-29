

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
import * as Keychain from 'react-native-keychain';
import { useAppDispatch, useAppSelector } from '../src/store/store';
import { config, updateUserList, updateMB_LOGIN_GUID, clearUserList, updateLoginList, clearLoginList } from '../src/store/slices/configReducer';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default FlatListCategory = ({ route, onPressCategory }) => {
    return (route &&
        (<ScrollView
            paddingTop={deviceWidth * 0.03}
            height={deviceWidth * 0.3}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false} >
            {route.map((item, index) => {
                return (
                    <>
                        <View style={{ width: deviceWidth * 0.2, height: deviceWidth * 0.4, }}>
                            <TouchableOpacity style={{
                                backgroundColor: '#fff', alignSelf: 'center', padding: deviceWidth * 0.03,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5,
                                justifyContent: 'center', borderRadius: deviceWidth * 0.05, flexDirection: 'row', backgroundColor: Colors.itemColor
                            }}
                                onPress={() => onPressCategory(item)}>
                                <Image
                                    style={{
                                        height: deviceWidth * 0.1,
                                        width: deviceWidth * 0.1,
                                        resizeMode: 'contain',
                                    }}
                                    source={{ uri: `data:image/png;base64,${item.IMAGE64}` }}
                                />
                            </TouchableOpacity>
                            <Text style={{
                                fontFamily: 'Kanit-Light',
                                textAlign: 'center'
                            }}>
                                {`${item.SHWPH_TTL_CPTN}`}
                            </Text>
                        </View>
                    </>
                )
            })}
            <View style={{ width: deviceWidth * 0.2, height: deviceWidth * 0.3, }}>
                <TouchableOpacity style={{
                    backgroundColor: '#fff', alignSelf: 'center', padding: deviceWidth * 0.03,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                    justifyContent: 'center', borderRadius: deviceWidth * 0.05, flexDirection: 'row', backgroundColor: Colors.itemColor
                }}
                    onPress={() => onPressCategory('ALL')}>
                    <View style={{
                        height: deviceWidth * 0.1,
                        width: deviceWidth * 0.1,
                        alignSelf: 'center',
                        justifyContent: 'center',
                    }}>
                        <Text style={{
                            fontFamily: 'Kanit-Bold',
                            textAlign: 'center'
                        }}>
                            ALL
                        </Text>
                    </View>

                </TouchableOpacity>
                <Text style={{
                    fontFamily: 'Kanit-Light',
                    textAlign: 'center'
                }}>
                    {`ทั้งหมด`}
                </Text>
            </View>
        </ScrollView>)
    )
}

