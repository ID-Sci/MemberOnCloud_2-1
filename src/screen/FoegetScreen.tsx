

import React, { useState, useEffect } from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    FlatList,
    ActivityIndicator,
    Dimensions,
    Text,
    BackHandler,
    Image,
    Alert,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,

} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

import Colors from '../styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontSize } from '../styles/FontSizeHelper'; 
import { config, updateUserList, updateMB_LOGIN_GUID, clearUserList, updateLoginList, clearLoginList } from '../store/slices/configReducer';
import CurrencyInput from 'react-native-currency-input';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useAppDispatch, useAppSelector } from '../store/store';
import moment from 'moment';
import { Language } from '../translations/I18n';
import RNRestart from 'react-native-restart';
import * as Keychain from 'react-native-keychain';
import { styles,statusBarHeight, deviceWidth,deviceHeight} from '../styles/styles';

const FoegetScreen = ({ route }: any) => {
    const dispatch = useAppDispatch();
    const [LoginState, setLoginState] = useState(true)
    const [Phone, setPhone] = useState('')
    const [GetNewpassword, setGetNewpassword] = useState(false)
    const [loading, setloading] = useState(false)
    const ConfigList = useAppSelector(config)
    const navigation = useNavigation()
    const setPhoneNum = (val: any) => {
        setPhone(val.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'))
        setNewData({
            ...newData,
            MB_REG_MOBILE: val.replace(/(\d{3})(\d{3})(\d{4})/, '$1$2$3')
        })

    }
    const [showPassword, setShowPassword] = useState(false)

    const [newData, setNewData] = useState({
        MB_CNTRY_CODE: '66',
        MB_REG_MOBILE: '',
        MB_PW: '',
        MB_CPW: '',
        MB_PASSWORD: ''
    });
    const ResetMobilePassword = async () => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        await setloading(true)
        await fetch(configToken.WebService + '/MbUsers', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'ResetMobilePassword',
                'BPAPUS-PARAM':
                    '{"MB_CNTRY_CODE":"' +
                    newData.MB_CNTRY_CODE +
                    '","MB_REG_MOBILE":"' +
                    newData.MB_REG_MOBILE + '"}',
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                console.log(json)
                if (json.ResponseCode == 200) {
                    setGetNewpassword(true)
                    setloading(false)
                } else {
                    console.log('Function Parameter Required');
                    let temp_error = 'error_ser.' + json.ResponseCode;
                    console.log('>> ', temp_error)
                    Alert.alert(
                      Language.t('alert.errorTitle'),
                      Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => setloading(false) }])
                }
            })
            .catch((error) => {

                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => setloading(false) }])
                console.log('ERROR ' + error);
            });

    }
    const LoginByMobile = async () => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        await setloading(true)
        console.log(JSON.stringify({
            'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
            'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
            'BPAPUS-FUNCTION': 'LoginByMobile',
            'BPAPUS-PARAM':
                '{"MB_CNTRY_CODE":"' +
                newData.MB_CNTRY_CODE +
                '","MB_REG_MOBILE":"' +
                newData.MB_REG_MOBILE +
                '","MB_PW":"' +
                newData.MB_PASSWORD + '"}',
        }))
        await fetch(configToken.WebService + '/MbUsers', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'LoginByMobile',
                'BPAPUS-PARAM': '{"MB_CNTRY_CODE":"' +
                    newData.MB_CNTRY_CODE +
                    '","MB_REG_MOBILE":"' +
                    newData.MB_REG_MOBILE +
                    '","MB_PW":"' +
                    newData.MB_PASSWORD + '"}',
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                console.log(json)
                if (json.ResponseCode == 200) {
                    let responseData = JSON.parse(json.ResponseData);
                    SetPassword(responseData.MB_LOGIN_GUID)
                } else {
                    console.log('Function Parameter Required');
                    let temp_error = 'error_ser.' + json.ResponseCode;
                    console.log('>> ', temp_error)
                    Alert.alert(
                      Language.t('alert.errorTitle'),
                      Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => console.log() }])
                }
            })
            .catch((error) => {

                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => console.log() }])
                console.log('ERROR ' + error);
            });
        await setloading(false)
    }
    const SetPassword = async (LOGIN_GUID: any) => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        await setloading(true)
        console.log(JSON.stringify({
            'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
            'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
            'BPAPUS-FUNCTION': 'SetPassword',
            'BPAPUS-PARAM':
                '{"MB_CNTRY_CODE":"' +
                newData.MB_CNTRY_CODE +
                '","MB_REG_MOBILE":"' +
                newData.MB_REG_MOBILE +
                '","MB_PW":"' +
                newData.MB_PASSWORD + '"}',
        }))
        await fetch(configToken.WebService + '/MbUsers', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'SetPassword',
                'BPAPUS-PARAM': '{"MB_PW":"' +
                    newData.MB_PW +
                    '","MB_LOGIN_GUID":"' +
                    LOGIN_GUID + '"}',
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                console.log(json)
                if (json.ResponseCode == 200) {
                    getMemberInfo(LOGIN_GUID)
                } else {
                    console.log('Function Parameter Required');
                    let temp_error = 'error_ser.' + json.ResponseCode;
                    console.log('>> ', temp_error)
                    Alert.alert(
                      Language.t('alert.errorTitle'),
                      Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => setloading(false) }])
                }
            })
            .catch((error) => {

                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => setloading(false) }])
                console.log('ERROR ' + error);
            });

    }

    const getMemberInfo = async (MB_LOGIN_GUID: any) => {
        console.log(`getProJ [Ec000400]`)
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null

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
                    await dispatch(updateMB_LOGIN_GUID(MB_LOGIN_GUID))
                    const NewKey = { ...configToken, Phone: newData.MB_REG_MOBILE, MB_PW: newData.MB_PW, logined: 'true' }
                    await Keychain.setGenericPassword("config", JSON.stringify(NewKey))
                    navigation.goBack()
                    // await RNRestart.restart()
                } else {
                    console.log('Function Parameter Required');
                    let temp_error = 'error_ser.' + json.ResponseCode;
                    console.log('>> ', temp_error)
                    Alert.alert(
                      Language.t('alert.errorTitle'),
                      Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => setloading(false) }])
                }
            })
            .catch((error) => {
                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => setloading(false) }])
                console.log('ERROR ' + error);
            });
        await setloading(false)
    }

    const checkScreen = () => {
        return (

            <ScrollView>

                <View style={{ padding: deviceWidth * 0.05 }}>

                    <KeyboardAvoidingView behavior={'height'}>
                        <ScrollView>


                            <View style={{
                                marginTop: deviceWidth * 0.05
                            }}>
                                <Text style={styles.textLight}>
                                    {Language.t('register.mobileNo')}
                                </Text>
                                <View style={{
                                    backgroundColor: Colors.backgroundColorSecondary,
                                    borderRadius: 10,
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                    paddingTop: 10,
                                    height: 'auto',
                                    paddingBottom: 10,
                                    borderColor: 'gray',
                                    borderWidth: 0.7,
                                    flexDirection: 'row',
                                }}>
                                    <TextInput
                                        placeholderTextColor={Colors.fontColorSecondary}
                                        value={Phone}
                                        onChangeText={(item: any) => setPhoneNum(item)}
                                        keyboardType="number-pad"
                                        placeholder={'0XX-XXX-XXXX'}
                                        maxLength={12}
                                        style={styles.textInput}></TextInput>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => ResetMobilePassword()}
                                style={{
                                    marginTop: deviceHeight * 0.03,
                                    marginBottom: deviceHeight * 0.03,
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
                                        borderRadius: deviceWidth * 0.1,
                                    }}

                                >
                                    <Text style={styles.text_btn}
                                    >
                                        {Language.t('alert.confirm')}
                                    </Text>

                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>

        )
    }
    const confirmScreen = () => {
        return (

            <ScrollView>

                <View style={{ padding: deviceWidth * 0.05 }}>

                    <KeyboardAvoidingView behavior={'height'}>
                        <ScrollView>
                            <View style={{
                                marginTop: deviceWidth * 0.05
                            }}>
                                <Text style={styles.textLight}>
                                    {Language.t('register.secretPassword')}
                                </Text>
                                <View style={{
                                    backgroundColor: Colors.backgroundColorSecondary,
                                    borderRadius: 10,
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                    paddingTop: 10,
                                    height: 'auto',
                                    paddingBottom: 10,
                                    borderColor: 'gray',
                                    borderWidth: 0.7,
                                    flexDirection: 'row',
                                }}>
                                    <TextInput
                                        placeholderTextColor={Colors.fontColorSecondary}
                                        value={newData.MB_PASSWORD}
                                        secureTextEntry={true}
                                        onChangeText={(item: any) => setNewData({
                                            ...newData,
                                            MB_PASSWORD: item,
                                        })}

                                        placeholder={Language.t('register.forgotPassword')}

                                        style={styles.textInput}></TextInput>
                                </View>
                            </View>

                            <View style={{
                                marginTop: deviceWidth * 0.05
                            }}>
                                <Text style={styles.textLight}>
                                    {Language.t('register.password')}
                                </Text>
                                <View style={{
                                    backgroundColor: Colors.backgroundColorSecondary,
                                    borderRadius: 10,
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                    paddingTop: 10,
                                    height: 'auto',
                                    paddingBottom: 10,
                                    borderColor: newData.MB_PW == newData.MB_CPW ? 'gray' : 'red',
                                    borderWidth: 0.7, alignItems: 'center',
                                    flexDirection: 'row',
                                }}>
                                    <TextInput
                                        placeholderTextColor={Colors.fontColorSecondary}
                                        value={newData.MB_PW}
                                        keyboardType="default"
                                        secureTextEntry={!showPassword}
                                        onChangeText={(item: any) => setNewData({
                                            ...newData,
                                            MB_PW: item,
                                        })}

                                        placeholder={Language.t('register.password')}

                                        style={styles.textInput}></TextInput>
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                                resizeMode: 'contain',
                                            }}
                                            source={showPassword ? require('../img/iconsMenu/eye.png') : require('../img/iconsMenu/eye-off.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{
                                marginTop: deviceWidth * 0.05
                            }}>
                                <Text style={styles.textLight}>
                                    {Language.t('register.confirmPassword')}
                                </Text>
                                <View style={{
                                    backgroundColor: Colors.backgroundColorSecondary,
                                    borderRadius: 10,
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                    paddingTop: 10,
                                    height: 'auto',
                                    paddingBottom: 10,
                                    borderColor: newData.MB_PW == newData.MB_CPW ? 'gray' : 'red',
                                    borderWidth: 0.7,
                                    flexDirection: 'row',
                                }}>
                                    <TextInput
                                        placeholderTextColor={Colors.fontColorSecondary}
                                        value={newData.MB_CPW}
                                        keyboardType="default"
                                        secureTextEntry={!showPassword}
                                        onChangeText={(item: any) => setNewData({
                                            ...newData,
                                            MB_CPW: item,
                                        })}
                                        placeholder={Language.t('register.confirmPassword')}
                                        style={styles.textInput}></TextInput>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => LoginByMobile()}
                                style={{
                                    marginTop: deviceHeight * 0.03,
                                    marginBottom: deviceHeight * 0.03,
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
                                        borderRadius: deviceWidth * 0.1,
                                    }}

                                >
                                    <Text style={styles.text_btn}
                                    >

                                        {Language.t('alert.confirm')}
                                    </Text>

                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>

            </ScrollView>
        )
    }
    const loadingScreen = () => {
        return (
            <View
                style={{
                    width: deviceWidth,
                    height: deviceHeight + statusBarHeight,
                    opacity: 0.5,

                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    position: 'absolute',
                }}>
                <ActivityIndicator
                    animating={true}
                    size="large"
                    color={Colors.lightPrimiryColor}
                />
            </View>
        )
    }
    return (
        (
            <View
                style={{
                    width: deviceWidth,
                    height: deviceHeight+statusBarHeight
                }}
            >

                <View

                    style={styles.header}>
                    <Text style={styles.header_text_title} >
                        {route.params.name}
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.header_text_Xtitle} >
                            x
                        </Text>
                    </TouchableOpacity>
                </View>
                {
                    loading ? loadingScreen() : GetNewpassword ? confirmScreen() : checkScreen()
                }
            </View>
        )
    )
}


export default FoegetScreen 