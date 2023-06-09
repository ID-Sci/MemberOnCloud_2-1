

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
import CalendarScreen from '@blacksakura013/th-datepicker';
import moment from 'moment';
import * as Keychain from 'react-native-keychain';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

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

                    Alert.alert(`สำเร็จ`, `${json.ReasonString}`, [
                        { text: `ยืนยัน`, onPress: () => setGetNewpassword(true) }])
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
        await setloading(false)
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
                    Alert.alert(`แจ้งเตือน`, `${json.ReasonString}`, [
                        { text: `ยืนยัน`, onPress: () => console.log() }])
                }
            })
            .catch((error) => {

                Alert.alert(`แจ้งเตือน`, `${error}`, [
                    { text: `ยืนยัน`, onPress: () => console.log() }])
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
                    Alert.alert(`แจ้งเตือน`, `${json.ReasonString}`, [
                        { text: `ยืนยัน`, onPress: () => console.log() }])
                }
            })
            .catch((error) => {

                Alert.alert(`แจ้งเตือน`, `${error}`, [
                    { text: `ยืนยัน`, onPress: () => console.log() }])
                console.log('ERROR ' + error);
            });
        await setloading(false)
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
                    Alert.alert(`สำเร็จ`, `${json.ReasonString}`, [
                        { text: `ยืนยัน`, onPress: () => dispatch(updateMB_LOGIN_GUID(MB_LOGIN_GUID)) }])
                    const NewKey = { ...configToken, Phone: newData.MB_REG_MOBILE, MB_PW: newData.MB_PASSWORD, logined: 'true' }
                    await Keychain.setGenericPassword("config", JSON.stringify(NewKey))
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

    const checkScreen = () => {
        return (

            <ScrollView >

                <View style={{ padding: deviceWidth * 0.05 }}>

                    <KeyboardAvoidingView behavior={'height'}>
                        <ScrollView   >


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
                                    <Text style={{
                                        fontSize: FontSize.large,
                                        color: Colors.buttonTextColor
                                    }}
                                    >
                                        {`ยืนยัน`}
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

            <ScrollView >
                <View style={{ padding: deviceWidth * 0.05 }}>

                    <KeyboardAvoidingView behavior={'height'}>
                        <ScrollView   >
                            <View style={{
                                marginTop: deviceWidth * 0.05
                            }}>
                                <Text style={styles.textTitle}>
                                    รหัสลับ
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
                                        keyboardType="default"
                                        secureTextEntry={true}
                                        onChangeText={(item: any) => setNewData({
                                            ...newData,
                                            MB_PASSWORD: item,
                                        })}

                                        placeholder={`รหัสลับ`}

                                        style={styles.textInput}></TextInput>
                                </View>
                            </View>

                            <View style={{
                                marginTop: deviceWidth * 0.05
                            }}>
                                <Text style={styles.textTitle}>
                                    รหัสผ่านใหม่
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
                                    ยืนยันรหัสผ่านใหม่
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
                                    <Text style={{
                                        fontSize: FontSize.large,
                                        color: Colors.buttonTextColor
                                    }}
                                    >

                                        {`ยืนยัน`}
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
                    height: deviceHeight,
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
                    height: deviceHeight
                }}
            >

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
                {
                    loading ? loadingScreen() : GetNewpassword ? confirmScreen() : checkScreen()
                }
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
});

export default FoegetScreen 