

import React, { useRef, useState, useEffect } from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    RefreshControl,
    FlatList,
    Dimensions,
    Animated,
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

import { mycardSelector, updateMycardPage } from '../store/slices/mycardReducer';
import { useAppDispatch, useAppSelector } from '../store/store';
import { config, updateARcode, updateMB_LOGIN_GUID, updateUserList, clearUserList, updateLoginList, clearLoginList } from '../store/slices/configReducer';
import * as Keychain from 'react-native-keychain';
import * as safe_Format from '../styles/safe_Format';
import RNRestart from 'react-native-restart';
import { Language } from '../translations/I18n';
import { styles, statusBarHeight, deviceWidth, deviceHeight } from '../styles/styles';
import RNFetchBlob from 'rn-fetch-blob';
const MyCardScreen = () => {
    const ConfigList = useAppSelector(config)
    const navigation = useNavigation()
    const [Vsersion, setVsersion] = useState(null)
    const [loading, setLoading] = useState(false);
    const [loadingMyCard, setLoadingMyCard] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15);
    const scrolling = useRef(new Animated.Value(0)).current;
    const [UserList, setUserList] = useState(ConfigList.UserList)
    const dispatch = useAppDispatch();
    let MycardList = useAppSelector(mycardSelector)
    const [MycardData, setMycardData] = useState(MycardList.mycardPage)
    let CState = true
    useEffect(() => {

        const intervalId = setInterval(() => {
            decrementClock();
        }, 1000);
        return () => {
            clearInterval(intervalId);
        }
    })

    useEffect(() => {
        ConfigList.MB_LOGIN_GUID != '' && getItemImage()
    }, [ConfigList.MB_LOGIN_GUID])
    const getItemImage = async () => {
        let tempMycardData = [];


        for (var i in MycardData) {
            console.log(JSON.stringify(MycardData))
            const updatedMycardData = { ...MycardData[i], IMAGE64: await getImagefile('ShowPage', MycardData[i]) };

            tempMycardData.push(updatedMycardData);
        }

        setMycardData(tempMycardData)
        dispatch(updateMycardPage(tempMycardData))
    }
    const getImagefile = async (FilePath: string, item: any) => {
        try {
            const checkLoginToken = await Keychain.getGenericPassword();
            const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null;
            if (!configToken) {
                throw new Error("Config token not found.");
            }
            let temp_res = ""
            let Parameter = {}
            if (FilePath == 'ShowPage') {
                Parameter = {
                    'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                    'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                    FilePath: 'ShowPage',
                    FileName: item.SHWPH_GUID,
                }
            } else if (FilePath == 'ShowContent') {
                Parameter = {
                    'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                    'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                    FilePath: 'ShowContent',
                    FileName: item.SHWC_GUID,
                }
            }

            await RNFetchBlob.fetch('GET', configToken.WebService + '/DownloadFile', Parameter).then((res) => {
                temp_res = res.data;
            });


            return temp_res
        } catch (error) {
            console.error("Error while fetching image:", error);
            return null; // Handle the error gracefully in your application
        }
    };
    const decrementClock = async () => {
        if (timeLeft === 0) {
            await setTimeLeft(15);
            if (CState)
                await getMemberInfo(ConfigList.MB_LOGIN_GUID)
        } else {
            await setTimeLeft(timeLeft - 1);
        }
    }


    useEffect(() => {
        getVersionData()
    })
    useEffect(() => {
        console.log(`JSON.stringify(ConfigList.UserList) >> ${JSON.stringify(ConfigList.UserList)}`)
        ConfigList.UserList.MB_CODE ?
            setUserList(ConfigList.UserList) : onsetData()
    }, [ConfigList.UserList])
    const onsetData = async () => {
        await setLoadingMyCard(true)
        await getMemberInfo(ConfigList.MB_LOGIN_GUID)
        await setLoadingMyCard(false)
    }
    const onRefresh = async () => {
        await setTimeLeft(15);
        await setLoading(true)
        if (CState)
            await getMemberInfo(ConfigList.MB_LOGIN_GUID)
        await setLoading(false)
    }
    const getVersionData = async () => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        setVsersion(configToken.upDateVsersion)
    }

    const getlogoutMbUsers = async () => {
        console.log(`logoutMbUsers`)
        setLoadingMyCard(true)
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
                    await setLoadingMyCard(false)
                    // await RNRestart.restart();
                } else {
                    CState = false
                    console.log('Function Parameter Required');
                    let temp_error = 'error_ser.' + json.ResponseCode;
                    console.log('>> ', temp_error)
                    Alert.alert(
                        Language.t('alert.errorTitle'),
                        Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () =>    setLoadingMyCard(false) }])
                }
            })
            .catch((error) => {
                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () =>    setLoadingMyCard(false) }])
                console.log('ERROR ' + error);
            });

    }

    const getMemberInfo = async (MB_LOGIN_GUID: any) => {
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
                    await GetARinfo(responseData.ShowMemberInfo[0])
                } else {
                    CState = false
                    console.log('Function Parameter Required');
                    let temp_error = 'error_ser.' + json.ResponseCode;
                    console.log('>> ', temp_error)
                    Alert.alert(
                        Language.t('alert.errorTitle'),
                        Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => RNRestart.restart() }])
                }
            })
            .catch((error) => {
                CState = false
                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => RNRestart.restart() }])
                console.log('ERROR ' + error);
            })

    }
    const GetARinfo = async (MemberInfo: any) => {

        console.log(`GetARinfo`)
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        const { MB_CODE } = MemberInfo
        console.log(MB_CODE)
        if (MB_CODE) {
            await fetch(configToken.WebService + '/LookupErp', {
                method: 'POST',
                body: JSON.stringify({
                    'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                    'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                    'BPAPUS-FUNCTION': 'Ar000130',
                    'BPAPUS-PARAM': '',
                    'BPAPUS-FILTER': `AND(AR_MBCODE = '${MB_CODE}')`,
                    'BPAPUS-ORDERBY': '',
                    'BPAPUS-OFFSET': '0',
                    'BPAPUS-FETCH': '0',
                }),
            })
                .then((response) => response.json())
                .then(async (json) => {
                    console.log(json.ReasonString)
                    if (json.ResponseCode == 200) {
                        let responseData = JSON.parse(json.ResponseData);
                        if (responseData.Ar000130.length > 0) {
                            MemberInfo.ADDB_KEY = responseData.Ar000130[0].ADDB_KEY
                            MemberInfo.AR_KEY = responseData.Ar000130[0].AR_KEY
                            MemberInfo.AR_CODE = responseData.Ar000130[0].AR_CODE
                            MemberInfo.ADDB_ADDB_1 = responseData.Ar000130[0].ADDB_ADDB_1
                            MemberInfo.ADDB_SUB_DISTRICT = responseData.Ar000130[0].ADDB_SUB_DISTRICT
                            MemberInfo.ADDB_DISTRICT = responseData.Ar000130[0].ADDB_DISTRICT
                            MemberInfo.ADDB_PROVINCE = responseData.Ar000130[0].ADDB_PROVINCE
                            MemberInfo.ADDB_POST = responseData.Ar000130[0].ADDB_POST
                            await setUserList(MemberInfo)
                            await dispatch(updateUserList(MemberInfo))
                            await dispatch(updateARcode(responseData.Ar000130[0].AR_CODE))
                            console.log(responseData.ReasonString)
                        }
                    } else {
                        CState = false
                        Alert.alert(Language.t('notiAlert.header'), `${json.ReasonString}`, [
                            { text: Language.t('alert.confirm'), onPress: () => BackHandler.exitApp() }])
                    }
                })
                .catch((error) => {
                    CState = false
                    Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                        { text: Language.t('alert.confirm'), onPress: () => BackHandler.exitApp() }])
                    console.log('ERROR ' + error);
                })
        }
    }
    return (
        <Animated.ScrollView

            refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
            bounces={loading}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{ height: deviceHeight + statusBarHeight }}

            onScroll={Animated.event(
                [{
                    nativeEvent: {
                        contentOffset: {
                            y: scrolling,

                        },
                    }

                }],
                { useNativeDriver: true }
            )} >
            {loadingMyCard &&
                <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={loadingMyCard}
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
                                animating={loadingMyCard}
                                size="large"
                                color={Colors.lightPrimiryColor} />
                        </View>
                    </View>
                </Modal>
                }
                <View style={{ alignItems: 'flex-end', backgroundColor: '#fff', }}>

                    <View style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        paddingTop: statusBarHeight,
                        height: deviceHeight * 0.4,
                        width: deviceWidth * 0.9,
                        borderRadius: deviceWidth * 0.05,
                    }}
                    >
                        <View >

                            <View>
                                <Image
                                    style={{
                                        height: deviceHeight * 0.3,
                                        width: undefined,
                                        alignSelf: 'stretch',
                                        resizeMode: 'contain',
                                    }}
                                    source={{ uri: `data:image/png;base64,${MycardData[0].IMAGE64}` }}></Image>
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
                                        {UserList && UserList.MB_CODE}
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
                                        {`${UserList && UserList.MB_NAME} ${UserList && UserList.MB_SURNME}`}
                                    </Text>
                                </View>

                            </View>
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Updateuser', { name: Language.t('profile.editProfile') })}
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
                                        - {Language.t('profile.header')} -
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        </View>



                    </View>
                    <ScrollView >


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
                                    {Language.t('profileCard.code')}
                                </Text>
                                <Text style={styles.textLight}>{UserList && UserList.MB_CODE} </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginTop: 5,
                                    justifyContent: 'space-between',
                                }}>
                                <Text style={styles.textLight}>
                                    {Language.t('profileCard.rewardPoint')}
                                </Text>
                                <Text style={styles.textLight}> {UserList && safe_Format.pointFormat(UserList.MB_SH_POINT)}  </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginTop: 5,
                                    justifyContent: 'space-between',
                                }}>
                                <Text style={styles.textLight}>
                                    {Language.t('profileCard.rewardPointToday')}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('History')}
                                >
                                    <Text style={styles.textLink}>
                                        {Language.t('profileCard.detail')}
                                    </Text>
                                </TouchableOpacity>

                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginTop: 5,
                                    justifyContent: 'space-between',
                                }}>
                                <Text style={styles.textLight}>
                                    {Language.t('profileCard.myPurchase')}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('PurchaseHistory')}
                                >
                                    <Text style={styles.textLink}>
                                        {Language.t('profileCard.viewOrderHistory')}
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
                                    {Language.t('profileCard.dateOfExpiry')}
                                </Text>
                                <Text style={styles.textLight}>
                                    {UserList && safe_Format.dateFormat(UserList.MB_EXPIRE)}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('SelLanguage')}
                                style={{
                                    flexDirection: 'row',
                                    marginTop: 5,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderBottomColor: 'black',

                                }}>
                                <View >
                                    <Text style={styles.textLight}>
                                        {Language.t('menu.language')}
                                    </Text>
                                    <Text style={styles.textLightborder} >
                                        {Language.t('menu.lang')}
                                    </Text>
                                </View>

                                <Text style={styles.textBold}>
                                    {`>`}
                                </Text>
                            </TouchableOpacity>
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
                                            {Language.t('menu.logout')}
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
        </Animated.ScrollView>

    )

}

export default MyCardScreen 