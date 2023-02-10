

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
import Colors from '../src/styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontSize } from '../src/styles/FontSizeHelper';
import CurrencyInput from 'react-native-currency-input';
import FlatListPromotion from '../components/FlatListPromotion';
import { BorderlessButton } from 'react-native-gesture-handler';
import { mycardSelector, } from '../src/store/slices/mycardReducer';
import { useAppDispatch, useAppSelector } from '../src/store/store';
import { config, updateMB_LOGIN_GUID, updateUserList, clearUserList, updateLoginList, clearLoginList } from '../src/store/slices/configReducer';
import * as Keychain from 'react-native-keychain';
import * as safe_Format from '../src/styles/safe_Format';
import RNRestart from 'react-native-restart';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const MyCardScreen = () => {
    const ConfigList = useAppSelector(config)
    const navigation = useNavigation()
    const [order, setOrder] = useState(1)
    const dispatch = useAppDispatch();
    let MycardList = useAppSelector(mycardSelector)
    console.log(ConfigList.UserList)
    const getlogoutMbUsers = async () => {
        console.log(`logoutMbUsers`)
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = JSON.parse(checkLoginToken.password)

        await fetch(configToken.WebService + '/MbUsers', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'Logout',
                'BPAPUS-PARAM': '{"MB_LOGIN_GUID": "' +
                    ConfigList.MB_LOGIN_GUID +
                    '"}',
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                console.log(json)
                if (json.ResponseCode == 200) {
                    let responseData = JSON.parse(json.ResponseData);
                     dispatch(updateMB_LOGIN_GUID(''))
                   
                    Alert.alert(`สำเร็จ`, `${json.ReasonString}`, [
                        { text: `ยืนยัน`, onPress: () => console.log() }])
                } else {
                    Alert.alert(`แจ้งเตือน`, `${json.ReasonString}`, [
                        { text: `ยืนยัน`, onPress: () => console.log() }])
                }
            })
            .catch((error) => {
                Alert.alert(`แจ้งเตือน`, `${error}`, [
                    { text: `ยืนยัน`, onPress: () => console.log() }])
                console.log('ERROR ' + error);
            });
    }
    return (

        <View style={{ alignItems: 'flex-end', backgroundColor: '#fff', }}>
            <View style={{
                alignSelf: 'center',
                justifyContent: 'center',

                height: deviceHeight * 0.4,
                width: deviceWidth * 0.9,
                borderRadius: deviceWidth * 0.05,
            }}
            >
                <View>
                    <Image
                        style={{
                            height: deviceHeight * 0.3,
                            width: undefined,
                            alignSelf: 'stretch',
                        }}
                        resizeMode="stretch"
                        source={{ uri: `data:image/png;base64,${MycardList.mycardPage[0].IMAGE64}` }}></Image>
                    <View
                        style={{
                            flexDirection: 'column',
                            position: 'absolute',
                            top: 0,
                            left: 30,
                            right: 0,
                            bottom: 20,
                            justifyContent: 'flex-end',
                            alignItems: 'flex-start',
                        }}>
                        <Text
                            style={{
                                shadowColor: 'black',
                                fontWeight: 'bold',
                                shadowOpacity: 0.8,
                                shadowRadius: 3,
                                elevation: 5,
                                fontSize: FontSize.medium,
                                textShadowOffset: { width: 3, height: 3 },
                                textShadowRadius: 1,
                                color: 'white',
                            }}>
                            {ConfigList.UserList.MB_CODE}
                        </Text>
                        <Text
                            style={{
                                shadowColor: 'black',
                                shadowOpacity: 0.8,
                                shadowRadius: 3,
                                elevation: 5,
                                fontSize: FontSize.medium,
                                textShadowOffset: { width: 3, height: 3 },
                                textShadowRadius: 1,
                                color: 'white',
                            }}>
                            {`${ConfigList.UserList.MB_NAME} ${ConfigList.UserList.MB_SURNME}`}
                        </Text>
                    </View>
                </View>

            </View>
            <ScrollView

            >


                <View style={{
                    width: deviceWidth,
                    height: deviceHeight * 0.6,
                    padding: deviceWidth * 0.05,
                    backgroundColor: '#fff',
                }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: 20,
                            justifyContent: 'space-between',
                        }}>
                        <Text style={{ fontSize: FontSize.medium }}>
                            รหัสบัตรสมาชิก
                        </Text>
                        <Text style={{ fontSize: FontSize.medium }}>{ConfigList.UserList.MB_CODE} </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: 5,
                            justifyContent: 'space-between',
                        }}>
                        <Text style={{ fontSize: FontSize.medium }}>
                            แต้มสะสม
                        </Text>
                        <Text style={{ fontSize: FontSize.medium }}> {safe_Format.pointFormat(ConfigList.UserList.MB_SH_POINT)}  </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: 5,
                            justifyContent: 'space-between',
                        }}>
                        <Text style={{ fontSize: FontSize.medium }}>
                            แต้มวันนี้ ( มีผลวันถัดไป )
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('History')}
                        >
                            <Text
                                style={{
                                    color: '#0288D1',
                                    textDecorationLine: 'underline',
                                    fontSize: FontSize.medium,
                                }}>
                                รายละเอียด
                            </Text>
                        </TouchableOpacity>

                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: 5,
                            justifyContent: 'space-between',
                            borderBottomColor: 'black',

                        }}>
                        <Text style={{ fontSize: FontSize.medium }}>
                            วันหมดอายุบัตร
                        </Text>
                        <Text style={{ fontSize: FontSize.medium }}>
                            {safe_Format.dateFormat(ConfigList.UserList.MB_EXPIRE)}
                        </Text>
                    </View>
                    <View style={{ marginTop: deviceHeight * 0.1 }} >
                        <TouchableOpacity
                            onPress={() => getlogoutMbUsers()}
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
                                    backgroundColor: 'red',
                                    height: deviceHeight * 0.07,
                                    borderRadius: deviceWidth * 0.1,
                                }}

                            >
                                <Text style={{
                                    fontSize: FontSize.large,
                                    color: Colors.buttonTextColor
                                }}
                                >

                                    {`ออกจากระบบ`}


                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>





            </ScrollView>
        </View >


    )

}

export default MyCardScreen 