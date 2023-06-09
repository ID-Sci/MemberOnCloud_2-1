

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
import NumberPad from '../components/NumberPad';
import OtpInput from '../components/OtpInput';
import { config, updateUserList, updateMB_LOGIN_GUID, clearUserList, updateLoginList, clearLoginList } from '../store/slices/configReducer';
import CurrencyInput from 'react-native-currency-input';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useAppDispatch, useAppSelector } from '../store/store';
import CalendarScreen from '@blacksakura013/th-datepicker';
import moment from 'moment';
import * as Keychain from 'react-native-keychain';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const defaultCountDown = 60;

const RegisterScreen = ({ route }: any) => {
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
                'แจ้งเตือน',
                'OTP หมดอายุ โปรดกด \"ตกลง\"\nเพื่อรับ OTP อีกครั้ง', [{ text: 'ตกลง', onPress: () => otpRequest() }]);
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

    const [newData, setNewData] = useState({
        MB_INTL: 'นาย',
        MB_NAME: '',
        MB_SURNME: '',
        MB_SEX: '',
        MB_BIRTH: new Date(),
        MB_ADDR_1: '',
        MB_ADDR_2: '',
        MB_ADDR_3: '',
        MB_POST: '',
        MB_I_CARD: '',
        MB_EMAIL: '',
        MB_CNTRY_CODE: '66',
        MB_REG_MOBILE: '',
        MB_PW: '',
        MB_CPW: ''
    });

    const CState = () => {
        let C = true
        if (!newData.MB_NAME) {
            C = false
            console.log(`MB_NAME`)
        }
        if (!newData.MB_SURNME) {
            C = false
            console.log(`MB_SURNME`)
        }
        if (!newData.MB_I_CARD) {
            C = false
            console.log(`MB_I_CARD`)
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
                'พบข้อผิดพลาด', 'กรุณาระบุข้อมูลให้ถูกต้อง', [{ text: 'ตกลง', onPress: () => console.log(C) }]);
        }
    }
    const otpRequest = async () => {
        setCountdown(defaultCountDown)
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
                    'รหัสยืนยันการยืนยันตน Member' + 'OTP-Ref: ' + otpPassword,
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
                    console.log(`otp Request Success => { ${otpPassword} }`);
                    Alert.alert('', `ระบบจะแจ้ง OTP ผ่าน SMS ของหมายเลขโทรศัพท์มือถือ\nเบอร์มือถือ (+66) ${Phone}`, [{ text: 'ตกลง', onPress: () => setLoading(false) }]);
                }
            })
            .catch((error) => {
                console.log('ERROR otpRequest :' + error);


                Alert.alert(
                    'พบข้อผิดพลาด', error, [{ text: 'ตกลง', onPress: () => BackHandler.exitApp() }]);
                console.log('checkIPAddress>>', error);

                setLoading(false)
            });

    };


    const getNewMemberMbUsers = async () => {

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
                'BPAPUS-FUNCTION': 'NewMember',
                'BPAPUS-PARAM':
                    '{"MB_INTL":  "' +
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
                console.log(json)
                if (json.ResponseCode == 200) {
                    LoginByMobile()
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
                    await getMemberInfo(responseData.MB_LOGIN_GUID)
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
                    await updateMB_LOGIN_GUID(MB_LOGIN_GUID)
                    const NewKey = { ...configToken, Phone: newData.MB_REG_MOBILE, MB_PW: newData.MB_PW, logined: 'true' }
                    await Keychain.setGenericPassword("config", JSON.stringify(NewKey))
                    navigation.goBack()
                    setLoading(false)
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
    const UpdateMember = async (NEW_GUID: any) => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        let sex = 'M'
        let birthDate = ''
        if (newData.MB_BIRTH == '') {
            let nowDate = new Date();
            birthDate = `${nowDate.getFullYear()}${nowDate.getMonth().toString().length > 1 ? nowDate.getMonth() : '0' + nowDate.getMonth()}${nowDate.getDate().toString().length > 1 ? nowDate.getDate() : '0' + nowDate.getDate()}`
        } else {
            let nowDate = newData.MB_BIRTH.split('-')
            birthDate = nowDate[2] + nowDate[1] + nowDate[0];
        }
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
                setCountdown(0)
                setPinCode('')
                setRegis(false)
                getNewMemberMbUsers()
            }
            else {
                Alert.alert(`แจ้งเตือน`, `รหัสไม่ถูกต้อง`, [
                    { text: `ยืนยัน`, onPress: () => setPinCode('') }])
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
                {Regis ? (<>
                    <View style={{ flex: 0.6, }}>
                        <View style={{ flex: 1, marginTop: 60, justifyContent: 'center' }}>
                            <Text

                                style={{
                                    fontSize: FontSize.large,
                                    alignSelf: 'center',
                                    color: Colors.textColor,
                                }}>
                                {`ยืนยันการลงทะเบียนเรียบร้อย`}
                            </Text>
                            <Text

                                style={{
                                    textAlign: 'center',
                                    fontSize: FontSize.medium,
                                    alignSelf: 'center',
                                    color: Colors.textColor,
                                }}>
                                {` ระบบจะแจ้ง OTP ผ่าน SMS ของหมายเลขโทรศัพท์มือถือ (+66) ${Phone}`}

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
                                        {`ส่ง OTP ใหม่อีกครั้ง ${countdown}`}
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
                                    <Text allowFontScaling={false} style={styles.text}>
                                        1
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ ...styles.box }}
                                    onPress={() => handlePinCode('2')}>
                                    <Text allowFontScaling={false} style={styles.text}>
                                        2
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ ...styles.box }}
                                    onPress={() => handlePinCode('3')}>
                                    <Text allowFontScaling={false} style={styles.text}>
                                        3
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={styles.box}
                                    onPress={() => handlePinCode('4')}>
                                    <Text allowFontScaling={false} style={styles.text}>
                                        4
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.box}
                                    onPress={() => handlePinCode('5')}>
                                    <Text allowFontScaling={false} style={styles.text}>
                                        5
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.box}
                                    onPress={() => handlePinCode('6')}>
                                    <Text allowFontScaling={false} style={styles.text}>
                                        6
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={styles.box}
                                    onPress={() => handlePinCode('7')}>
                                    <Text allowFontScaling={false} style={styles.text}>
                                        7
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.box}
                                    onPress={() => handlePinCode('8')}>
                                    <Text allowFontScaling={false} style={styles.text}>
                                        8
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.box}
                                    onPress={() => handlePinCode('9')}>
                                    <Text allowFontScaling={false} style={styles.text}>
                                        9
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.row}>
                                <View

                                    style={styles.box}
                                >
                                    <Text allowFontScaling={false} style={styles.text}>

                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.box}
                                    onPress={() => handlePinCode('0')}>
                                    <Text allowFontScaling={false} style={styles.text}>
                                        0
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ borderRightWidth: 0, ...styles.box }}
                                    onPress={() => handlePinCode('del')}>
                                    <Image
                                        style={{
                                            resizeMode: 'contain',
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
                            style={{
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                width: deviceWidth,
                                padding: deviceHeight * 0.02,
                                backgroundColor: Colors.backgroundLoginColorSecondary,
                                borderBottomWidth: 1,
                                borderColor: Colors.borderColor
                            }}>
                            <Text
                                style={{
                                    fontSize: FontSize.medium,
                                    color: Colors.menuButton,
                                    fontWeight: 'bold',
                                }}>
                                {route.params.name}
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={{
                                    fontSize: FontSize.large,
                                }}
                                >
                                    x
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <KeyboardAvoidingView keyboardVerticalOffset={2} behavior={'height'}>
                            <ScrollView >
                                <View style={{ padding: deviceWidth * 0.05 }}>
                                    <Text style={styles.textTitle}>
                                        คำนำหน้า
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
                                        <Text style={styles.textTitle}>
                                            ชื่อ
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
                                                placeholder={`ชื่อ`}

                                                style={styles.textInput}></TextInput>
                                        </View>
                                    </View>
                                    <View style={{
                                        marginTop: deviceWidth * 0.05
                                    }}>
                                        <Text style={styles.textTitle}>
                                            นามสกุล
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
                                                placeholder={`นามสกุล`}

                                                style={styles.textInput}></TextInput>
                                        </View>
                                    </View>
                                    {/* <View style={{
                                        marginTop: deviceWidth * 0.05
                                    }}>
                                        <Text style={styles.textTitle}>
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
                                                style={styles.textInput}></TextInput>
                                        </View>
                                    </View> */}
                                    <View style={{
                                        marginTop: deviceWidth * 0.05
                                    }}>
                                        <Text style={styles.textTitle}>
                                            เบอร์โทร
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
                                    <View style={{
                                        marginTop: deviceWidth * 0.05
                                    }}>
                                        <Text style={styles.textTitle}>
                                            วันเกิด
                                        </Text>
                                        <View style={{

                                        }}>
                                            <CalendarScreen
                                                value={newData.MB_BIRTH}
                                                language={'th'}
                                                era={'be'}
                                                format={'dd month yyyy'}
                                                borderColor={'gray'}
                                                linkTodateColor={Colors.itemColor}
                                                calendarModel={{ backgroundColor: Colors.backgroundLoginColorSecondary, buttonSuccess: { backgroundColor: Colors.itemColor }, pickItem: { color: Colors.itemColor } }}
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
                                        <Text style={styles.textTitle}>
                                            ที่อยู่-ถนน
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
                                                placeholder={`ที่อยู่-ถนน`}

                                                style={styles.textInput}></TextInput>
                                        </View>
                                    </View>
                                    <View style={{
                                        marginTop: deviceWidth * 0.05
                                    }}>
                                        <Text style={styles.textTitle}>
                                            ตำบล/แขวง และ อำเภอ/เขต
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
                                                placeholder={`ตำบล/แขวง และ อำเภอ/เขต`}
                                                style={styles.textInput}></TextInput>
                                        </View>
                                    </View>
                                    <View style={{
                                        marginTop: deviceWidth * 0.05
                                    }}>
                                        <Text style={styles.textTitle}>
                                            จังหวัด
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
                                                placeholder={`จังหวัด`}

                                                style={styles.textInput}></TextInput>
                                        </View>
                                    </View>
                                    <View style={{
                                        marginTop: deviceWidth * 0.05
                                    }}>
                                        <Text style={styles.textTitle}>
                                            รหัสไปรษณีย์
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
                                                placeholder={`รหัสไปรษณีย์`}

                                                style={styles.textInput}></TextInput>
                                        </View>
                                    </View>
                                    <View style={{
                                        marginTop: deviceWidth * 0.05
                                    }}>
                                        <Text style={styles.textTitle}>
                                            อีเมล์
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
                                                placeholder={`อีเมล์`}
                                                style={styles.textInput}></TextInput>
                                        </View>
                                    </View>

                                    <View style={{
                                        marginTop: deviceWidth * 0.05
                                    }}>
                                        <Text style={styles.textTitle}>
                                            รหัสผ่าน
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

                                                placeholder={`รหัสผ่าน`}

                                                style={styles.textInput}></TextInput>
                                        </View>
                                    </View>
                                    <View style={{
                                        marginTop: deviceWidth * 0.05
                                    }}>
                                        <Text style={styles.textTitle}>
                                            ยืนยันรหัสผ่าน
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
                                                placeholder={`ยืนยันรหัสผ่าน`}
                                                style={styles.textInput}></TextInput>
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
                                            <Text style={{
                                                fontSize: FontSize.large,
                                                color: Colors.buttonTextColor
                                            }}
                                            >
                                                {`ลงทะเบียน`}
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

const styles = StyleSheet.create({
    container1: {

        paddingBottom: 0,
        flex: 1,
        flexDirection: 'column',

    },
    container2: {
        width: deviceWidth,
        height: '100%',
        position: 'absolute',
        backgroundColor: 'white',
        flex: 1,
    },
    button: {
        marginTop: 10,
        padding: 5,
        marginBottom: 20,
        alignItems: 'center',
        backgroundColor: Colors.buttonColorPrimary,
        borderRadius: 10,
    },
    textTitle: {
        fontSize: FontSize.medium,
        color: Colors.fontColor,
    },
    textTitle2: {
        alignSelf: 'center',
        fontSize: FontSize.medium,
        color: Colors.fontColor,
    },
    textButton: {
        color: Colors.fontColor2,
        fontSize: FontSize.medium,
        padding: 10,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    textInput: {
        flex: 8,
        color: Colors.fontColor,
        fontSize: FontSize.medium,
        height: 'auto',
        borderBottomWidth: 0.7,
    },
    row: {
        flexDirection: 'row',
        flex: 0.25,
        backgroundColor: 'white',
    },
    box: {
        flex: 1 / 3,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 0.3,
        // borderColor: "#BDBDBD"
    },
    text: {
        fontSize: FontSize.large,
    }
});

export default RegisterScreen