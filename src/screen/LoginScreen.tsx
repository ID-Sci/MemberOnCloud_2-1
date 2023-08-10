

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
import Colors from '../styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontSize } from '../styles/FontSizeHelper';
import { config, updateUserList, updateMB_LOGIN_GUID, clearUserList, updateLoginList, clearLoginList } from '../store/slices/configReducer';
import CurrencyInput from 'react-native-currency-input';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useAppDispatch, useAppSelector } from '../store/store';
import RNRestart from 'react-native-restart';
import { Language } from '../translations/I18n';
import * as Keychain from 'react-native-keychain';
import { styles } from '../styles/styles';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const LoginScreen = () => {
    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = useState(false)
    const [Vsersion, setVsersion] = useState(null)
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
    useEffect(() => {
        getVersionData()
    })
    const getVersionData = async () => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        setVsersion(configToken.upDateVsersion)
    }
    const getLoginMbUsers = async () => {
        setLoading(true)
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
                    await getMemberInfo(responseData.MB_LOGIN_GUID)
                    // Alert.alert(`สำเร็จ`, `${json.ReasonString}`, [
                    //     { text: Language.t('alert.confirm'), onPress: () => console.log() }])
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
        await setLoading(false)
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
                    const NewKey = { ...configToken, Phone: PhoneParm, MB_PW: PasswordParm, logined: 'true' }
                    await Keychain.setGenericPassword("config", JSON.stringify(NewKey))
                    await setLoading(false)
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
                                resizeMode: 'contain',
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
                            <Text style={styles.textLight_title}>
                                {Language.t('register.header2')}
                            </Text>
                        </View>
                        <View style={{ height: 40, flexDirection: 'row' }}>
                            <TextInput
                                style={styles.inputtextLight_title}
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
                        <View style={{ height: 40, flexDirection: 'row', alignItems: 'center', }}>
                            <TextInput
                                style={styles.inputtextLight_title}
                                value={PasswordParm}
                                onChangeText={(val) => {
                                    setPasswordParm(val);
                                }}
                                secureTextEntry={!showPassword}
                                keyboardType="default"
                                placeholder={`${Language.t('register.password')}..`}
                                placeholderTextColor={Colors.fontColorSecondary}
                            ></TextInput>
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Image
                                    style={{
                                        width: 30,
                                        height: 30,
                                        resizeMode: 'contain',
                                    }}
                                    resizeMode={'contain'}
                                    source={showPassword ? require('../img/iconsMenu/eye.png') : require('../img/iconsMenu/eye-off.png')}
                                />
                            </TouchableOpacity>

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
                                <Text style={styles.text_btn} >

                                    {Language.t('login.buttonLogin')}


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
                                onPress={() => navigation.navigate('Foeget', { name: Language.t('register.forgotPassword') })}
                            >
                                <Text style={{ alignSelf: 'center', borderBottomWidth: 1, paddingBottom: 1, fontWeight: '900' }}>
                                    {`  ${Language.t('register.forgotPassword')}  `}
                                </Text>
                            </TouchableOpacity>
                            <Text
                                style={{ alignSelf: 'center', fontWeight: '900' }}
                            >{` | `}</Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Register', { name: Language.t('register.registration') })}
                            >
                                <Text style={{ alignSelf: 'center', borderBottomWidth: 1, paddingBottom: 1, fontWeight: '900' }}>
                                    {`  ${Language.t('register.registration')}  `}
                                </Text>
                            </TouchableOpacity>

                        </View>


                        <View style={{ marginTop: 5, alignItems: 'center' }}>
                            <Text style={{
                                fontSize: FontSize.medium * 0.8,
                                fontWeight: 'bold',
                                color: Colors.borderColor
                            }}>
                                {Vsersion != null && `version ${Vsersion}`}
                            </Text>
                        </View>
                    </View>


                </View>
                <View style={{
                    width: deviceWidth,
                    position: 'absolute',
                    alignItems: 'flex-end',
                    padding: 10
                }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'baseline'
                        }}
                        onPress={() => navigation.navigate('SelLanguage')}>
                        <Text style={styles.textLight}>
                            {Language.getLang()}
                        </Text>
                        <Image
                            style={{
                                width: 30,
                                height: 30,
                                resizeMode: 'contain',
                            }}
                            resizeMode={'contain'}
                            source={require('../img/iconsMenu/world.png')}
                        />

                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    )
}

export default LoginScreen 