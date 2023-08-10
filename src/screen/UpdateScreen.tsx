

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
    KeyboardAvoidingView,
    ActivityIndicator,
    Modal

} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

import Colors from '../styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontSize } from '../styles/FontSizeHelper';
import { styles } from '../styles/styles';
import NumberPad from '../components/NumberPad';
import OtpInput from '../components/OtpInput';
import { config, updateUserList, updateMB_LOGIN_GUID, clearUserList, updateLoginList, clearLoginList } from '../store/slices/configReducer';
import CurrencyInput from 'react-native-currency-input';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useAppDispatch, useAppSelector } from '../store/store';
import CalendarScreen from '@blacksakura013/th-datepicker';
import { Language } from '../translations/I18n';
import moment from 'moment';
import * as Keychain from 'react-native-keychain';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const defaultCountDown = 60;

const UpdateScreen = ({ route }: any) => {
    const dispatch = useAppDispatch();
    const [countdown, setCountdown] = useState(0);
    const [loading, setLoading] = useState(false);
    const [Regis, setRegis] = useState(false)
    const [Phone, setPhone] = useState('')
    const [I_CARD, setI_CARD] = useState('')
    const [pinCode, setPinCode] = useState('')

    const ConfigList = useAppSelector(config)
    const navigation = useNavigation()

    const [code, setCode] = useState('')
    const [OTPpassword, setOTPpassword] = useState('');

    let clockCall: any = 0;


    useEffect(() => {
        if (clockCall = 0) console.log(`stop`)
        else {
            clockCall = setInterval(() => {
                decrementClock();
            }, 1000);
            return () => {
                clearInterval(clockCall);
            };
        }
    });
    const decrementClock = () => {
        if (countdown === 1) {
            clearInterval(clockCall);
            Alert.alert(
                Language.t('notiAlert.header'),
                Language.t('register.OTPexpired'), [{ text: Language.t('alert.ok'), onPress: () => otpRequest() }]);
        } else if (countdown === 0) {

        } else {
            setCountdown(countdown - 1)
        }
    };
    const setPhoneNum = (val: any) => {
        setPhone(val.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'))
        setNewData({
            ...newData,
            MB_REG_MOBILE: val.replace(/(\d{3})(\d{3})(\d{4})/, '$1$2$3')
        })

    }
    const set_I_CARD = (val: any) => {
        setI_CARD(val.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, '$1 $2 $3 $4 $5'))
        setNewData({
            ...newData,
            MB_I_CARD: val.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, '$1$2$3$4$5')
        })

    }

    useEffect(() => {
        setPhoneNum(ConfigList.UserList.MB_REG_MOBILE)
        ConfigList.UserList.MB_I_CARD && set_I_CARD(ConfigList.UserList.MB_I_CARD)
    }, [])
    const [newData, setNewData] = useState({
        MB_INTL: ConfigList.UserList.MB_INTL?ConfigList.UserList.MB_INTL:' ',
        MB_NAME: ConfigList.UserList.MB_NAME,
        MB_SURNME: ConfigList.UserList.MB_SURNME,
        MB_SEX: ConfigList.UserList.MB_SEX,
        MB_BIRTH: new Date(ConfigList.UserList.MB_BIRTH.substr(0, 4) + '-' + ConfigList.UserList.MB_BIRTH.substr(4, 2) + '-' + ConfigList.UserList.MB_BIRTH.substr(6, 2)),
        MB_ADDR_1: ConfigList.UserList.MB_ADDR_1,
        MB_ADDR_2: ConfigList.UserList.MB_ADDR_2,
        MB_ADDR_3: ConfigList.UserList.MB_ADDR_3,
        MB_POST: ConfigList.UserList.MB_POST,
        MB_EMAIL: ConfigList.UserList.MB_EMAIL,
        MB_CNTRY_CODE: ConfigList.UserList.MB_CNTRY_CODE,
        MB_REG_MOBILE: ConfigList.UserList.MB_REG_MOBILE,
        MB_PW: '',
        MB_CPW: ''
    });

    const CState = () => {
        setLoading(true)
        let C = true
        if (!newData.MB_NAME) {
            C = false
            console.log(`MB_NAME`)
        }
        if (!newData.MB_SURNME) {
            C = false
            console.log(`MB_SURNME`)
        }
     
        if (!newData.MB_REG_MOBILE) {
            C = false
            console.log(`MB_REG_MOBILE`)
        }
        if (!newData.MB_EMAIL) {
            C = false
            console.log(`MB_EMAIL`)
        }
        if (!newData.MB_POST) {
            C = false
            console.log(`MB_POST`)
        }
        if (!newData.MB_ADDR_1) {
            C = false
            console.log(`MB_ADDR_1`)
        }
        if (!newData.MB_ADDR_2) {
            C = false
            console.log(`MB_ADDR_2`)
        }
        if (!newData.MB_ADDR_3) {
            C = false
            console.log(`MB_ADDR_3`)
        }
        if (!newData.MB_PW) {
            C = false
            console.log(`MB_PW`)
        }
        if (!newData.MB_CPW) {
            C = false
            console.log(`MB_CPW`)
        }
        if (C) {
            setRegis(true)
            otpRequest()
        } else {
            Alert.alert(
                Language.t('alert.errorTitle'), Language.t('alert.specifyInformation'), [{ text: Language.t('alert.ok'), onPress: () => console.log(C) }]);
        }
        setLoading(false)
    }
    const otpRequest = async () => {
      
      await  setLoading(true)
        let otpPassword: any = Math.floor(1000 + Math.random() * 9000)
        setOTPpassword(otpPassword);

        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null


        await fetch(configToken.OTPService + '/RegisterNotify', {
            method: 'POST',
            headers: JSON.stringify({
                'Content-Type': 'application/json',
                'User-Agent': '.NET Foundation Repository Reporter',
            }),
            body: JSON.stringify({
                NTFU_OTP_MESSAGE:
                    Language.t('register.verificationCode') + 'OTP-Ref: ' + otpPassword,
                NTFU_CNTRY_CODE: '66',
                NTFU_MOBILE: newData.MB_REG_MOBILE,
                NTFU_DISPLAY: 'Display',
                NTFU_NAME: newData.MB_REG_MOBILE,
                NTFU_MAC_ADDRESS: configToken.Mac,
                NTFU_PASSWORD: configToken.Password,
                NTFU_SVID: configToken.ServiceID.NTFU_SVID,
                NTFU_USERID: configToken.BPLUS_APPID + configToken.Phone,
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                if (json[0].NTFU_GUID) {
                    setCountdown(defaultCountDown)
                    setLoading(false) 
                    console.log(`otp Request Success => { ${otpPassword} }`);
                    Alert.alert('', `${Language.t('register.informOtp')} (+66) ${Phone}`, [{ text: Language.t('alert.ok'), onPress: () => setLoading(false) }]);
                }
            })
            .catch((error) => {
                console.log('ERROR otpRequest :' + error);


                Alert.alert(
                    Language.t('alert.errorTitle'), error, [{ text: Language.t('alert.ok'), onPress: () => BackHandler.exitApp() }]);
                console.log('checkIPAddress>>', error);

                setLoading(false)
            });

    };



    const LoginByMobile = async () => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null


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
                    newData.MB_PW + '"}',
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                console.log(json)
                if (json.ResponseCode == 200) {
                    let responseData = JSON.parse(json.ResponseData);
                    await UpdateMember(responseData.MB_LOGIN_GUID)
                    await getMemberInfo(responseData.MB_LOGIN_GUID)
                } else {
                    console.log('Function Parameter Required'); 
                    let temp_error = 'error_ser.' + json.ResponseCode;
                    console.log('>> ', temp_error)
                    Alert.alert(
                      Language.t('alert.errorTitle'),
                      Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => setLoading(false) }])
                }
            })
            .catch((error) => {

                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => setLoading(false) }])
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
                } else {
                    console.log('Function Parameter Required'); 
                    let temp_error = 'error_ser.' + json.ResponseCode;
                    console.log('>> ', temp_error)
                    Alert.alert(
                      Language.t('alert.errorTitle'),
                      Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => setLoading(false) }])
                }
            })
            .catch((error) => {
                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => setLoading(false) }])
                console.log('ERROR ' + error);
            });
        setLoading(false)
    }
    const UpdateMember = async (NEW_GUID: any) => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        let sex = 'M'
        let birthDate = ''
        let nowDate = new Date();
        if (newData.MB_BIRTH)
            nowDate = new Date(newData.MB_BIRTH)
        var day: any = nowDate.getDate()
        day = day > 9 ? day : '0' + day
        var month: any = nowDate.getMonth() + 1
        month = month > 9 ? month : '0' + month
        var year = nowDate.getFullYear()
        birthDate = year + '' + month + '' + day
        newData.MB_INTL == 'นาย' || newData.MB_INTL == 'คุณ' || newData.MB_INTL == 'ด.ช.' || newData.MB_INTL == 'MR.' ? sex = 'M' : sex = 'F'

        await fetch(configToken.WebService + '/MbUsers', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'UpdateMember',
                'BPAPUS-PARAM':
                    '{"MB_LOGIN_GUID":  "' +
                    NEW_GUID +
                    '","MB_INTL": "' +
                    newData.MB_INTL +
                    '","MB_NAME":"' +
                    newData.MB_NAME +
                    '","MB_SURNME":"' +
                    newData.MB_SURNME +
                    '","MB_SEX": "' +
                    sex +
                    '","MB_BIRTH": "' +
                    birthDate +
                    '","MB_ADDR_1": "' +
                    newData.MB_ADDR_1 +
                    '","MB_ADDR_2": "' +
                    newData.MB_ADDR_2 +
                    '","MB_ADDR_3": "' +
                    newData.MB_ADDR_3 +
                    '","MB_POST": "' +
                    newData.MB_POST +
                    '","MB_I_CARD": "' +
                    newData.MB_I_CARD +
                    '","MB_EMAIL": "' +
                    newData.MB_EMAIL +
                    '","MB_CNTRY_CODE":"' +
                    newData.MB_CNTRY_CODE +
                    '","MB_REG_MOBILE":"' +
                    newData.MB_REG_MOBILE +
                    '","MB_PW": "' +
                    newData.MB_PW + '"}',
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                if (json && json.ResponseCode == '200') {

                } else {
                    Alert.alert(Language.t('notiAlert.header'), `${json.ReasonString}`, [
                        { text: Language.t('alert.confirm'), onPress: () => setLoading(false) }])
                }
            })
            .catch((error) => {
                console.log('Function Parameter Required'); 
                let temp_error = 'error_ser.' + json.ResponseCode;
                console.log('>> ', temp_error)
                Alert.alert(
                  Language.t('alert.errorTitle'),
                  Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => setLoading(false) }])
                console.log('ERROR ' + error);
            });
    }

    const _PressResend = () => {
        setCountdown(defaultCountDown);

        clearInterval(clockCall);
        clockCall = setInterval(() => {
            decrementClock();
        }, 1000);
        otpRequest();
    };
    const handlePinCode = (code: any) => {

        let arr = pinCode.split('');
        let tempcode = ''
        if (code === 'del') {
            arr.pop();
            tempcode = arr.join('')
        } else {
            tempcode = pinCode + code
        }

        setPinCode(tempcode)

        if (tempcode.length == 4) {
            if (tempcode == OTPpassword) {
                setLoading(true)
                setCountdown(0)
                setPinCode('')
                setRegis(false)
                LoginByMobile()
            }
            else {
                Alert.alert(Language.t('notiAlert.header'), Language.t('register.invalidCode'), [
                    { text: Language.t('alert.confirm'), onPress: () => setPinCode('') }])
            }
        }
    }
    return (
        (
            <View
                style={{
                    width: deviceWidth,
                    height: deviceHeight
                }}
            >
                {loading &&
                    <Modal
                        transparent={true}
                        animationType={'none'}
                        visible={loading}
                        onRequestClose={() => { styles.header_text_title }}>
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
                {Regis ? (<>
                    <View style={{ flex: 0.6, }}>
                        <View style={{ flex: 1, marginTop: 60, justifyContent: 'center' }}>
                            <Text style={styles.textLight_title}>
                                {Language.t('register.confirmRegistration')}
                            </Text>
                            <Text style={styles.textLight_title}>
                                {`${Language.t('register.informOtp')} (+66) ${Phone}`}

                            </Text>
                            <OtpInput digit={4} pinCode={code ? pinCode : pinCode} />
                            <View style={{ marginTop: 20 }}>
                                <TouchableOpacity
                                    onPress={() => _PressResend()}
                                    style={{ alignSelf: 'center' }}>
                                    <Text
                                        style={[
                                            {
                                                fontSize: FontSize.medium,
                                                alignSelf: 'center',
                                                color: Colors.backgroundLoginColor,
                                                textDecorationLine: 'underline',
                                            },

                                        ]}>
                                        {`${Language.t('register.resendOtp')} ${countdown}`}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 0.4 }}>
                        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={{ ...styles.box }}
                                    onPress={() => handlePinCode('1')}>
                                    <Text allowFontScaling={false} style={styles.textBold_title}>
                                        1
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ ...styles.box }}
                                    onPress={() => handlePinCode('2')}>
                                    <Text allowFontScaling={false} style={styles.textBold_title}>
                                        2
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ ...styles.box }}
                                    onPress={() => handlePinCode('3')}>
                                    <Text allowFontScaling={false} style={styles.textBold_title}>
                                        3
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={styles.box}
                                    onPress={() => handlePinCode('4')}>
                                    <Text allowFontScaling={false} style={styles.textBold_title}>
                                        4
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.box}
                                    onPress={() => handlePinCode('5')}>
                                    <Text allowFontScaling={false} style={styles.textBold_title}>
                                        5
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.box}
                                    onPress={() => handlePinCode('6')}>
                                    <Text allowFontScaling={false} style={styles.textBold_title}>
                                        6
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={styles.box}
                                    onPress={() => handlePinCode('7')}>
                                    <Text allowFontScaling={false} style={styles.textBold_title}>
                                        7
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.box}
                                    onPress={() => handlePinCode('8')}>
                                    <Text allowFontScaling={false} style={styles.textBold_title}>
                                        8
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.box}
                                    onPress={() => handlePinCode('9')}>
                                    <Text allowFontScaling={false} style={styles.textBold_title}>
                                        9
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.row}>
                                <View

                                    style={styles.box}
                                >
                                    <Text allowFontScaling={false} style={styles.textBold_title}>

                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.box}
                                    onPress={() => handlePinCode('0')}>
                                    <Text allowFontScaling={false} style={styles.textBold_title}>
                                        0
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ borderRightWidth: 0, ...styles.box }}
                                    onPress={() => handlePinCode('del')}>
                                    <Image
                                        style={{

                                            height: FontSize.large * 2,
                                            width: FontSize.large * 2,
                                        }}
                                        source={require('../img/iconsMenu/deleteText.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View></>) : (
                    <>
                        <View
                            style={styles.header}>
                            <Text style={styles.header_text_title}>
                                {route.params.name}
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.header_text_Xtitle}>
                                    x
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <KeyboardAvoidingView keyboardVerticalOffset={2} behavior={'height'}>
                            <ScrollView >
                                <View style={{ padding: deviceWidth * 0.05 }}>
                                    <Text style={styles.textLight}>
                                        {Language.t('profile.title')}
                                    </Text>
                                    <View style={{
                                        backgroundColor: Colors.backgroundColorSecondary,

                                        borderRadius: 10,

                                        padding: 5,
                                        borderColor: 'gray',
                                        borderWidth: 0.7,
                                        flexDirection: 'row',
                                    }}>

                                        <Picker
                                            style={{
                                                backgroundColor: Colors.backgroundColorSecondary,
                                                fontFamily: 'Kanit-Bold',
                                                width: deviceWidth * 0.8,
                                            }}
                                            mode="dropdown"
                                            selectedValue={newData.MB_INTL}
                                            onValueChange={(item) => {
                                                setNewData({
                                                    ...newData,
                                                    MB_INTL: item,
                                                })
                                            }}
                                            itemStyle={{
                                                width: 50,
                                            }}>

                                            <Picker.Item label="นาย" value="นาย" />
                                            <Picker.Item label="คุณ" value="คุณ" />
                                            <Picker.Item label="ด.ช." value="ด.ช." />
                                            <Picker.Item label="ด.ญ." value="ด.ญ." />
                                            <Picker.Item label="นาง" value="นาง" />
                                            <Picker.Item label="น.ส." value="น.ส." />
                                            <Picker.Item label="MR." value="MR." />
                                            <Picker.Item label="MRS." value="MRS." />
                                            <Picker.Item label="Ms." value="Ms." />
                                        </Picker>
                                    </View>

                                    <View style={{
                                        marginTop: deviceWidth * 0.05
                                    }}>
                                        <Text style={styles.textLight}>
                                            {Language.t('profile.firstName')}
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
                                                value={newData.MB_NAME}
                                                onChangeText={(item: any) => setNewData({
                                                    ...newData,
                                                    MB_NAME: item,
                                                })}
                                                placeholder={Language.t('profile.firstName')}

                                                style={styles.inputtextLight_title}></TextInput>
                                        </View>
                                    </View>
                                    <View style={{
                                        marginTop: deviceWidth * 0.05
                                    }}>
                                        <Text style={styles.textLight}>
                                            {Language.t('profile.lastName')}
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
                                                value={newData.MB_SURNME}
                                                onChangeText={(item: any) => setNewData({
                                                    ...newData,
                                                    MB_SURNME: item,
                                                })}
                                                placeholder={Language.t('profile.lastName')}

                                                style={styles.inputtextLight_title}></TextInput>
                                        </View>
                                    </View>
                                    {/* <View style={{
                                        marginTop: deviceWidth * 0.05
                                    }}>
                                        <Text style={styles.textLight}>
                                            เลขประจำตัวประชาชน
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
                                                value={I_CARD}
                                                onChangeText={(item: any) => set_I_CARD(item)}
                                                placeholder={`X XXX XXXXXX XX X`}
                                                maxLength={17}
                                                style={styles.inputtextLight_title}></TextInput>
                                        </View>
                                    </View> */}
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
                                                style={styles.inputtextLight_title}></TextInput>
                                        </View>
                                    </View>
                                    <View style={{
                                        marginTop: deviceWidth * 0.05
                                    }}>
                                        <Text style={styles.textLight}>
                                            {Language.t('profile.birthday')}
                                        </Text>
                                        <View style={{

                                        }}>
                                            <CalendarScreen
                                                value={newData.MB_BIRTH}
                                                language={'th'}
                                                era={'be'}
                                                format={'dd month yyyy'}
                                                borderColor={'gray'}
                                                linkTodateColor={Colors.backgroundLoginColor}
                                                calendarModel={{ backgroundColor: Colors.backgroundLoginColorSecondary, buttonSuccess: { backgroundColor: Colors.backgroundLoginColor }, pickItem: { color: Colors.backgroundLoginColor } }}
                                                borderWidth={0.7}
                                                icon={{ color: Colors.fontColorSecondary }}
                                                fontSize={FontSize.medium}
                                                fontColor={Colors.fontColor}
                                                width={deviceWidth * 0.90}
                                                borderRadius={10}

                                                onChange={(item: any) => setNewData({
                                                    ...newData,
                                                    MB_BIRTH: item,
                                                })} />
                                        </View>
                                    </View>
                                    <View style={{
                                        marginTop: deviceWidth * 0.05
                                    }}>
                                        <Text style={styles.textLight}>
                                            {`${Language.t('profile.address')}-${Language.t('profile.road')}`}
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
                                                value={newData.MB_ADDR_1}
                                                onChangeText={(item: any) => setNewData({
                                                    ...newData,
                                                    MB_ADDR_1: item,
                                                })}
                                                placeholder={`${Language.t('profile.address')}-${Language.t('profile.road')}`}

                                                style={styles.inputtextLight_title}></TextInput>
                                        </View>
                                    </View>
                                    <View style={{
                                        marginTop: deviceWidth * 0.05
                                    }}>
                                        <Text style={styles.textLight}>
                                            {`${Language.t('profile.subdistrict')} ${Language.t('profile.and')} ${Language.t('profile.district')}`}
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
                                                value={newData.MB_ADDR_2}
                                                onChangeText={(item: any) => setNewData({
                                                    ...newData,
                                                    MB_ADDR_2: item,
                                                })}
                                                placeholder={`${Language.t('profile.subdistrict')} ${Language.t('profile.and')} ${Language.t('profile.district')}`}
                                                style={styles.inputtextLight_title}></TextInput>
                                        </View>
                                    </View>
                                    <View style={{
                                        marginTop: deviceWidth * 0.05
                                    }}>
                                        <Text style={styles.textLight}>
                                            {Language.t('profile.province')}
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
                                                value={newData.MB_ADDR_3}
                                                onChangeText={(item: any) => setNewData({
                                                    ...newData,
                                                    MB_ADDR_3: item,
                                                })}
                                                placeholder={Language.t('profile.province')}

                                                style={styles.inputtextLight_title}></TextInput>
                                        </View>
                                    </View>
                                    <View style={{
                                        marginTop: deviceWidth * 0.05
                                    }}>
                                        <Text style={styles.textLight}>
                                            {Language.t('profile.postCode')}
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
                                                value={newData.MB_POST}
                                                keyboardType="number-pad"
                                                onChangeText={(item: any) => setNewData({
                                                    ...newData,
                                                    MB_POST: item,
                                                })}
                                                placeholder={Language.t('profile.postCode')}

                                                style={styles.inputtextLight_title}></TextInput>
                                        </View>
                                    </View>
                                    <View style={{
                                        marginTop: deviceWidth * 0.05
                                    }}>
                                        <Text style={styles.textLight}>
                                            {Language.t('profile.email')}
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
                                                value={newData.MB_EMAIL}
                                                onChangeText={(item: any) => setNewData({
                                                    ...newData,
                                                    MB_EMAIL: item,
                                                })}
                                                placeholder={Language.t('profile.email')}
                                                style={styles.inputtextLight_title}></TextInput>
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
                                            borderWidth: 0.7,
                                            flexDirection: 'row',
                                        }}>
                                            <TextInput
                                                placeholderTextColor={Colors.fontColorSecondary}
                                                value={newData.MB_PW}
                                                keyboardType="default"
                                                secureTextEntry={true}
                                                onChangeText={(item: any) => setNewData({
                                                    ...newData,
                                                    MB_PW: item,
                                                })}

                                                placeholder={Language.t('register.password')}

                                                style={styles.inputtextLight_title}></TextInput>
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
                                                secureTextEntry={true}
                                                onChangeText={(item: any) => setNewData({
                                                    ...newData,
                                                    MB_CPW: item,
                                                })}
                                                placeholder={Language.t('register.confirmPassword')}
                                                style={styles.inputtextLight_title}></TextInput>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => CState()}
                                        style={{
                                            marginTop: deviceHeight * 0.03,
                                            marginBottom: deviceHeight * 0.05,
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
                                            <Text style={styles.text_btn}>
                                               {Language.t('register.registration')}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </>
                )}
            </View>
        )
    )
}


export default UpdateScreen