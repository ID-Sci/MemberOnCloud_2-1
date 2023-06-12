

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
import CurrencyInput from 'react-native-currency-input';
import FlatListPromotion from '../components/FlatListPromotion';
import { BorderlessButton } from 'react-native-gesture-handler';
import { mycardSelector, } from '../store/slices/mycardReducer';
import { useAppDispatch, useAppSelector } from '../store/store';
import { config, updateMB_LOGIN_GUID, updateUserList, clearUserList, updateLoginList, clearLoginList } from '../store/slices/configReducer';
import * as Keychain from 'react-native-keychain';
import * as safe_Format from '../styles/safe_Format';
import RNRestart from 'react-native-restart';
import { styles } from '../styles/styles';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const MyCardScreen = () => {
    const ConfigList = useAppSelector(config)
    const navigation = useNavigation()
    const [Vsersion, setVsersion] = useState(null)
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    let MycardList = useAppSelector(mycardSelector)
    useEffect(() => {
        getVersionData()
    })
    const getVersionData = async () => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        setVsersion(configToken.upDateVsersion)
    }
    console.log(ConfigList.UserList)
    const getlogoutMbUsers = async () => {
        console.log(`logoutMbUsers`)
        setLoading(true)
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null

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
                    const NewKey = { ...configToken, logined: 'false' }
                    await Keychain.setGenericPassword("config", JSON.stringify(NewKey))
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
    return (

        <View style={{ alignItems: 'flex-end', backgroundColor: '#fff', }}>
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
                alignSelf: 'center',
                justifyContent: 'center',

                height: deviceHeight * 0.4,
                width: deviceWidth * 0.9,
                borderRadius: deviceWidth * 0.05,
            }}
            >
                <View>
                    <View>
                        <Image
                            style={{
                                height: deviceHeight * 0.3,
                                width: undefined,
                                alignSelf: 'stretch',
                                resizeMode: 'contain',
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
                                    fontFamily: 'Kanit-Bold',
                                    shadowOpacity: 0.8,
                                    shadowRadius: 3,
                                    elevation: 5,
                                    fontSize: FontSize.medium,
                                    textShadowOffset: { width: 3, height: 3 },
                                    textShadowRadius: 1,
                                    color: 'white',
                                }}>
                                {ConfigList.UserList && ConfigList.UserList.MB_CODE}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'Kanit-Light',
                                    shadowColor: 'black',
                                    shadowOpacity: 0.8,
                                    shadowRadius: 3,
                                    elevation: 5,
                                    fontSize: FontSize.medium,
                                    textShadowOffset: { width: 3, height: 3 },
                                    textShadowRadius: 1,
                                    color: 'white',
                                }}>
                                {`${ConfigList.UserList && ConfigList.UserList.MB_NAME} ${ConfigList.UserList && ConfigList.UserList.MB_SURNME}`}
                            </Text>
                        </View>

                    </View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Updateuser', { name: 'แก้ไขข้อมูลส่วนตัว' })}
                            style={{

                                padding: deviceWidth * 0.025,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text
                                style={{

                                    fontFamily: 'Kanit-Bold',
                                    color: Colors.darkPrimiryColor
                                }}>
                                - ข้อมูลส่วนตัว -
                            </Text>
                        </TouchableOpacity>

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
                            justifyContent: 'space-between',
                        }}>
                        <Text style={styles.textLight}>
                            รหัสบัตรสมาชิก
                        </Text>
                        <Text style={styles.textLight}>{ConfigList.UserList && ConfigList.UserList.MB_CODE} </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: 5,
                            justifyContent: 'space-between',
                        }}>
                        <Text style={styles.textLight}>
                            แต้มสะสม
                        </Text>
                        <Text style={styles.textLight}> {ConfigList.UserList && safe_Format.pointFormat(ConfigList.UserList.MB_SH_POINT)}  </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: 5,
                            justifyContent: 'space-between',
                        }}>
                        <Text style={styles.textLight}>
                            แต้มวันนี้ ( มีผลวันถัดไป )
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('History')}
                        >
                            <Text
                                style={styles.textLink}>
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
                        <Text style={styles.textLight}>
                            วันหมดอายุบัตร
                        </Text>
                        <Text style={styles.textLight}>
                            {ConfigList.UserList && safe_Format.dateFormat(ConfigList.UserList.MB_EXPIRE)}
                        </Text>
                    </View>
                    <View style={{
                        marginTop: deviceHeight * 0.1, alignItems: 'center',
                        justifyContent: 'center',
                    }} >

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
                                    fontFamily: 'Kanit-Bold',
                                    fontSize: FontSize.large,
                                    color: Colors.buttonTextColor
                                }}
                                >
                                    {`ออกจากระบบ`}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <Text style={{
                            fontFamily: 'Kanit-Bold',
                            fontSize: FontSize.medium * 0.8,
                            color: Colors.borderColor
                        }}>
                            {Vsersion != null && `version ${Vsersion}`}
                        </Text>
                    </View>

                </View>

            </ScrollView>
        </View >


    )

}

export default MyCardScreen 