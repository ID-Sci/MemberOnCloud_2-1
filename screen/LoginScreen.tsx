

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
    ActivityIndicator,
    Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../src/styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontSize } from '../src/styles/FontSizeHelper';
import { config, updateUserList, updateMB_LOGIN_GUID, clearUserList, updateLoginList, clearLoginList } from '../src/store/slices/configReducer';
import CurrencyInput from 'react-native-currency-input';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useAppDispatch, useAppSelector } from '../src/store/store';
import * as Keychain from 'react-native-keychain';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const LoginScreen = () => {
    const dispatch = useAppDispatch();
    const [LoginState, setLoginState] = useState(true)
    const [Phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false);
    const [PhoneParm, setPhoneParm] = useState(0)
    const [PasswordParm, setPasswordParm] = useState('')
    const ConfigList = useAppSelector(config)
    const navigation = useNavigation()
    const setPhoneNum = (val: any) => {
        setPhone(val.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'))
        setPhoneParm(val.replace(/(\d{3})(\d{3})(\d{4})/, '$1$2$3'))
    }

    const getLoginMbUsers = async () => {
        console.log(`LoginByMobile`)
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null

        await fetch(configToken.WebService + '/MbUsers', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'LoginByMobile',
                'BPAPUS-PARAM': '{"MB_CNTRY_CODE": "66", "MB_REG_MOBILE": "' +
                    PhoneParm +
                    '","MB_PW": "' +
                    PasswordParm +
                    '"}',
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                console.log(json)
                if (json.ResponseCode == 200) {
                    let responseData = JSON.parse(json.ResponseData);
                    getMemberInfo(responseData.MB_LOGIN_GUID)
                    // Alert.alert(`สำเร็จ`, `${json.ReasonString}`, [
                    //     { text: `ยืนยัน`, onPress: () => console.log() }])
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
    const getMemberInfo = async (MB_LOGIN_GUID: any) => {
        console.log(`getProJ [Ec000400]`)
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        setLoading(true)
        await fetch(configToken.WebService + '/Member', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'ShowMemberInfo',
                'BPAPUS-PARAM':
                    '{ "MB_LOGIN_GUID": "' + MB_LOGIN_GUID + '"}',
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                console.log(json)
                if (json.ResponseCode == 200) {
                    let responseData = JSON.parse(json.ResponseData);
                    await dispatch(updateUserList(responseData.ShowMemberInfo[0]))
                    setLoading(false)
                    await dispatch(updateMB_LOGIN_GUID(MB_LOGIN_GUID))
                    const NewKey = { ...configToken, Phone: PhoneParm, MB_PW: PasswordParm, logined: 'true' }
                    await Keychain.setGenericPassword("config", JSON.stringify(NewKey))
                } else {
                    Alert.alert(`แจ้งเตือน`, `${json.ReasonString}`, [
                        { text: `ยืนยัน`, onPress: () => setLoading(false) }])
                }
            })
            .catch((error) => {
                Alert.alert(`แจ้งเตือน`, `${error}`, [
                    { text: `ยืนยัน`, onPress: () => setLoading(false) }])
                console.log('ERROR ' + error);
            });
    }

    return (
        (
            <ScrollView>
                {loading &&
                    <Modal
                        transparent={true}
                        animationType={'none'}
                        visible={loading}
                        onRequestClose={() => { }}>
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                flexDirection: 'column',
                            }}>
                            <View
                                style={{
                                    backgroundColor: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                    height: 100,
                                    width: 100,
                                    borderRadius: deviceWidth * 0.05
                                }}>
                                <ActivityIndicator
                                    animating={loading}
                                    size="large"
                                    color={Colors.lightPrimiryColor} />
                            </View>
                        </View>
                    </Modal>
                }
                <View style={{
                    backgroundColor: Colors.backgroundColor,
                    padding: deviceWidth * 0.1
                }} >

                    <View>
                        <Image
                            style={{
                                width: undefined,
                                height: deviceWidth / 1.5,
                            }}
                            resizeMode={'contain'}
                            source={require('../img/LogoBplusMember.png')}
                        />
                    </View>
                    <View
                        style={{
                            backgroundColor: Colors.backgroundLoginColorSecondary,

                            flexDirection: 'column',
                            borderRadius: 20,
                            padding: 20,
                        }}>
                        <View>
                            <Text style={{ alignSelf: 'center' }}>
                                ลงทะเบียนรับโปรดีๆ มากมาย
                            </Text>
                        </View>
                        <View style={{ height: 40, flexDirection: 'row' }}>
                            <TextInput
                                style={{
                                    flex: 8,
                                    marginLeft: 10,
                                    borderBottomColor: Colors.borderColor,
                                    color: Colors.fontColor,
                                    paddingVertical: 7,
                                    fontSize: FontSize.medium,
                                    borderBottomWidth: 0.7,
                                }}
                                value={Phone}
                                onChangeText={(val) => {
                                    setPhoneNum(val);
                                }}
                                keyboardType="number-pad"
                                placeholder={'0XX-XXX-XXXX'}
                                maxLength={12}
                                placeholderTextColor={Colors.fontColorSecondary}

                            ></TextInput>
                        </View>
                        <View style={{ height: 40, flexDirection: 'row' }}>
                            <TextInput
                                style={{
                                    flex: 8,
                                    marginLeft: 10,
                                    borderBottomColor: Colors.borderColor,
                                    color: Colors.fontColor,
                                    paddingVertical: 7,
                                    fontSize: FontSize.medium,
                                    borderBottomWidth: 0.7,
                                }}
                                value={PasswordParm}
                                onChangeText={(val) => {
                                    setPasswordParm(val);
                                }}
                                secureTextEntry={true}
                                keyboardType="default"
                                placeholder={'รหัสผ่าน ..'}
                                placeholderTextColor={Colors.fontColorSecondary}
                            ></TextInput>
                        </View>
                        <TouchableOpacity
                            onPress={() => getLoginMbUsers()}
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
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                            }}

                        >
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Foeget', { name: 'ลืมรหัสผ่าน' })}
                            >
                                <Text style={{ alignSelf: 'center', borderBottomWidth: 1, paddingBottom: 1, fontWeight: '900' }}>
                                    {`  ลืมรหัสผ่าน  `}
                                </Text>
                            </TouchableOpacity>
                            <Text
                                style={{ alignSelf: 'center', fontWeight: '900' }}
                            >{` | `}</Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Register', { name: 'ลงทะเบียน' })}
                            >
                                <Text style={{ alignSelf: 'center', borderBottomWidth: 1, paddingBottom: 1, fontWeight: '900' }}>
                                    {`  ลงทะเบียน  `}
                                </Text>
                            </TouchableOpacity>
                        </View>



                    </View>


                </View>

            </ScrollView>
        )
    )
}

export default LoginScreen 