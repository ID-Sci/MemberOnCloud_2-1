

import React, { useState, useEffect } from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    Dimensions,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Text,
    Image,
    BackHandler,
    TouchableOpacity,
    View,
} from 'react-native';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import { NetworkInfo } from "react-native-network-info";
import * as Keychain from 'react-native-keychain';
import Colors from '../styles/colors';
import { FontSize } from '../styles/FontSizeHelper';
import FlatSlider from '../components/FlatListSlider';
import RNRestart from 'react-native-restart';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { config, updateARcode, updateUserList, updateMB_LOGIN_GUID, clearUserList, updateLoginList, clearLoginList } from '../store/slices/configReducer';
import { docinfoSelector, updateDocinfoList, clearDocinfoList, updateDocinfoPage, clearDocinfoPage } from '../store/slices/docinfoReducer';
import { projSelector, updateProjList, clearProjList } from '../store/slices/projReducer';
import { promotionSelector, updatePromotionList, clearPromotionList, updatePromotionPage, clearPromotionPage } from '../store/slices/promotionReducer';
import { updateNotificationList, clearNotificationList, updateNotificationPage, clearNotificationPage } from '../store/slices/notificationReducer';
import { categorySelector, updateCategoryList, clearCategoryList, updateCategoryPage, clearCategoryPage } from '../store/slices/categoryReducer';
import { bannerSelector, updateBannerList, clearBannerList, updateBannerPage, clearBannerPage } from '../store/slices/bannerReducer';
import { activitySelector, updateActivityList, clearActivityList, updateActivityPage, clearActivityPage } from '../store/slices/activityReducer';
import { mycardSelector, updateMycardList, clearMycardList, updateMycardPage, clearMycardPage } from '../store/slices/mycardReducer';
import { newproductSlice, updateNewproductList, updateAllproductList, clearAllproductList, clearnewproductList, updateNewproductPage, clearNewproductPage, updateNewproductContent, clearNewproductContent } from '../store/slices/newproductReducer';
import { useAppDispatch, useAppSelector } from '../store/store';
import { Language, changeLanguage } from '../translations/I18n';
import { styles, statusBarHeight, deviceWidth, deviceHeight } from '../styles/styles';
const MyConfig = '/config.json';
let CState = true
const SpaceScreen = () => {
    const dispatch = useAppDispatch();
    const ConfigList = useAppSelector(config)
    const projList = useAppSelector(projSelector)
    let images: Array<[]> = [];
    const navigation = useNavigation();
    let ProducrALL: any[] = []
    useEffect(() => {
        if (CState)
            loadFuntion()
        else RNRestart.restart()
    }, []);

    const loadFuntion = async () => {
        // dispatch(updateConfigList())

        if (CState) await setConfig()
        if (CState) await UnRegister()
        if (CState) await setnotiItem()
        if (CState)
            navigation.dispatch(
                navigation.replace('bstab')
            )

    }

    const getMac = async () => {
        try {
            let mac = await DeviceInfo.getMacAddress();

            if (isValidMac(mac)) {
                console.log(await DeviceInfo.getDeviceName());
                console.log('\nmachine > > ' + mac);
                return mac;
            }

            let wifiMac = await NetworkInfo.getBSSID();

            if (isValidMac(wifiMac)) {
                console.log('\nmachine(wifi) > > ' + wifiMac);
                return wifiMac;
            }

            let deviceId = DeviceInfo.getUniqueId();

            if (isValidDeviceId(deviceId)) {
                console.log('\ndeviceId > > ' + JSON.stringify(deviceId));
                return deviceId;
            }

            let uuid = generateUUID();
            return uuid;
        } catch (error) {
            console.error(error);
            let uuid = generateUUID();
            return uuid;
        }
    };
    const isValidMac = (mac) => {
        return mac && mac.length > 0 && mac !== "02:00:00:00:00:00" && typeof (mac) !== 'object';
    };

    const isValidDeviceId = (deviceId) => {
        return deviceId && deviceId.length > 0 && deviceId !== "02:00:00:00:00:00" && typeof (deviceId) !== 'object';
    };

    const generateUUID = () => {
        let uuid = '';
        const characters = '0123456789abcdef';
        for (let i = 0; i < 36; i++) {
            if (i === 8 || i === 13 || i === 18 || i === 23) {
                uuid += '-';
            } else {
                uuid += characters[Math.floor(Math.random() * characters.length)];
            }
        }

        return uuid;
    };
    const setConfig = async () => {
        //npx react-native-rename "Travel App" -b "com.junedomingo.travelapp"
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        let superObj = {
            "WebService": "http://223.27.215.37:2541/BplusErpDvSvrIIS31.dll",
            "OTPService": "http://203.150.55.21:8891/BplusNotiService/BplusNotiIIS.dll",
            "ServiceID": {
                "ShowPrice": "{66365970-7284-465e-bd98-e99cd51bf7f1}",
                "ETransaction": "{167f0c96-86fd-488f-94d1-cc3169d60b1a}",
                "DeliveryRequest": "{a054c25a-b1bc-4359-927f-c6b4c817995e}",
                "DeliveryService": "{2ebf806a-0903-4cc6-afe3-8fa22d29c46c}",
                "CheckPrice": "{8298a46f-1c97-4ffd-9780-efb749ee8b9b}",
                "QueueBuster": "{60b9aae0-7b15-4110-9514-ed687d4439c5}",
                "DeliveryMonitor": "{9c88e551-cb87-4281-be45-6e10a6a79b85}",
                "VanSales": "{4c6be9a1-8692-436e-89d0-291aa876b559}",
                "WebBasket": "{d4b587e8-2a95-4c23-adc9-10cd0c72fbb3}",
                "MemberDeveloper": "{44fa3ed0-dc72-4b27-9c60-cf2a8532a019}",
                "WebBasketUsers": "{c2131f0b-f20b-4e1f-9403-2b1dc2787839}",
                "MemberUsers": "{622AA43A-7822-48FD-AC49-BDB400FFC3FA}",
                "QrPayment": "{5fdd2cd8-7a6f-4d7d-abec-263db6b0e78b}",
                "NTFU_SVID": "{9c6dd907-45ba-43ec-872b-69b928e64be2}"
            },
            "BPLUS_APPID": "cdaa9350-cb32-416e-a85b-6ecedd81ebdf",
            "Mac": await getMac(),
            "Username": "BUSINESS",
            "Password": "SYSTEM64",
            "Phone": "0828845662",
            "MB_PW": "",
            "logined": "false",
            "Language": Language.getLang(),
            "upDateVsersion": "3.0.7"
        }
        changeLanguage(configToken?.Language ? configToken.Language : Language.getLang())
        if (configToken == null || configToken.upDateVsersion != superObj.upDateVsersion) {
            await Keychain.setGenericPassword("config", JSON.stringify(superObj))
        }
    }


    const UnRegister = async () => {
        console.log(`UnRegister`)
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null

        await fetch(configToken.WebService + '/DevUsers', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': '',
                'BPAPUS-FUNCTION': 'UnRegister',
                'BPAPUS-PARAM':
                    '{"BPAPUS-MACHINE": "' +
                    configToken.Mac +
                    '"}',
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                console.log(json.ReasonString)
                await Register()
            }
            )
            .catch((error) => {
                console.log(error)
                CState = false
                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => BackHandler.exitApp() }])
            });
    }

    const Register = async () => {
        console.log(`Register`)
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null

        await fetch(configToken.WebService + '/DevUsers', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': '',
                'BPAPUS-FUNCTION': 'Register',
                'BPAPUS-PARAM':
                    '{"BPAPUS-MACHINE":"' +
                    configToken.Mac +
                    '","BPAPUS-CNTRY-CODE": "66","BPAPUS-MOBILE": "' +
                    configToken.Phone +
                    '"}',
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                console.log(json.ReasonString)

                if (json.ResponseCode == 200 && json.ReasonString == 'Completed') {
                    await fetchGuidLog()
                } else {
                    console.log('Function Parameter Required');
                    let temp_error = 'error_ser.' + json.ResponseCode;
                    console.log('>> ', temp_error)
                    Alert.alert(
                        Language.t('alert.errorTitle'),
                        Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => BackHandler.exitApp() }])
                }
            })
            .catch((error) => {
                console.log('ERROR ' + error);
                CState = false
                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => BackHandler.exitApp() }])

            });
    };

    const fetchGuidLog = async () => {
        console.log(`Login`)
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null

        await fetch(configToken.WebService + '/DevUsers', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': '',
                'BPAPUS-FUNCTION': 'Login',
                'BPAPUS-PARAM':
                    '{"BPAPUS-MACHINE": "' +
                    configToken.Mac +
                    '","BPAPUS-USERID": "' +
                    configToken.Username.toUpperCase() +
                    '","BPAPUS-PASSWORD": "' +
                    configToken.Password.toUpperCase() +
                    '"}',
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                console.log(json.ReasonString)
                if (json && json.ResponseCode == '200') {
                    let responseData = JSON.parse(json.ResponseData)
                    console.log(responseData)
                    console.log(`configToken.logined >> [${configToken.logined}]`)
                    if (configToken.logined == 'true') {
                        getLoginMbUsers(responseData)
                    }
                    dispatch(updateLoginList(responseData))
                    await getProJ(responseData)
                } else {
                    console.log('Function Parameter Required');

                    let temp_error = 'error_ser.' + json.ResponseCode;
                    console.log('>> ', temp_error)
                    Alert.alert(
                        Language.t('alert.errorTitle'),
                        Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => BackHandler.exitApp() }])
                }
            })
            .catch((error) => {
                console.log('ERROR ' + error);
                if (configToken.WebService == '') {
                } else {

                }
                CState = false
                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => BackHandler.exitApp() }])
            })
    }

    const getLoginMbUsers = async (LoginList: Object) => {
        console.log(`LoginByMobile`)
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        await fetch(configToken.WebService + '/MbUsers', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'LoginByMobile',
                'BPAPUS-PARAM': '{"MB_CNTRY_CODE": "66", "MB_REG_MOBILE": "' +
                    configToken.Phone +
                    '","MB_PW": "' +
                    configToken.MB_PW +
                    '"}',
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                console.log(json)
                if (json.ResponseCode == 200) {
                    let responseData = JSON.parse(json.ResponseData);
                    await getMemberInfo(LoginList, responseData.MB_LOGIN_GUID)
                } else {
                    const NewKey = { ...configToken, logined: 'false' }
                    await Keychain.setGenericPassword("config", JSON.stringify(NewKey))
                }
            })
            .catch(async (error) => {
                const NewKey = { ...configToken, logined: 'false' }
                await Keychain.setGenericPassword("config", JSON.stringify(NewKey))
                console.log('ERROR ' + error);
            })
    }

    const getMemberInfo = async (LoginList: Object, MB_LOGIN_GUID: any) => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        await fetch(configToken.WebService + '/Member', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': LoginList.BPAPUS_GUID,
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
                    await GetARinfo(LoginList, responseData.ShowMemberInfo[0], MB_LOGIN_GUID)
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
            })
    }
    const GetARinfo = async (LoginList: Object, MemberInfo: any, MB_LOGIN_GUID: any) => {

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
                    'BPAPUS-LOGIN-GUID': LoginList.BPAPUS_GUID,
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
                            const NewKey = { ...configToken, Phone: configToken.Phone, MB_PW: configToken.MB_PW, logined: 'true' }
                            await dispatch(updateMB_LOGIN_GUID(MB_LOGIN_GUID))
                            await Keychain.setGenericPassword("config", JSON.stringify(NewKey))
                            await dispatch(updateUserList(MemberInfo))
                            await dispatch(updateARcode(responseData.Ar000130[0].AR_CODE))
                            console.log(responseData.ReasonString)
                        }
                    } else {
                        Alert.alert(Language.t('notiAlert.header'), `${json.ReasonString}`, [
                            { text: Language.t('alert.confirm'), onPress: () => BackHandler.exitApp() }])
                    }
                })
                .catch((error) => {
                    Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                        { text: Language.t('alert.confirm'), onPress: () => BackHandler.exitApp() }])
                    console.log('ERROR ' + error);
                })
        }
    }
    const getProJ = async (LoginList: Object) => {
        console.log(`getProJ [Ec000400]`)
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        await fetch(configToken.WebService + '/ECommerce', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'Ec000400',
                'BPAPUS-PARAM': '',
                'BPAPUS-FILTER': "AND SHWJH_CODE='MEMBER ON CLOUD' ",
                'BPAPUS-ORDERBY': '',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '0'
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                console.log(json.ReasonString)
                if (json.ResponseCode == 200) {
                    let responseData = JSON.parse(json.ResponseData);

                    if (responseData.Ec000400.length > 0) {
                        console.log(responseData.Ec000400[0])
                        dispatch(updateProjList(responseData.Ec000400[0]))
                        await FetchDataProject(LoginList, responseData.Ec000400[0])
                    } else {
                        CState = false
                        console.log('Function Parameter Required');
                        let temp_error = 'error_ser.' + json.ResponseCode;
                        console.log('>> ', temp_error)
                        Alert.alert(
                            Language.t('alert.errorTitle'),
                            Language.t('error_ser.projectnotfound'), [{ text: Language.t('alert.ok'), onPress: () => BackHandler.exitApp() }])
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

    const FetchDataProject = async (LoginList: object, ProjList: object) => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        console.log(`FetchDataProject`)
        let fullDay: any = ''
        try {
            const response = await fetch(configToken.WebService + `/ServerReady?date_for_no_cache=${new Date().getMilliseconds()},randomForNoCache=${Math.random() * 10}`, {
                method: 'GET'
            });
            const datetime = response.headers.get('date');
            const x = new Date(datetime);
            const year = x.getFullYear().toString();
            const month = (x.getMonth() + 1).toString().padStart(2, '0');
            const day = x.getDate().toString().padStart(2, '0');
            fullDay = year + month + day;
        } catch (error) {
            console.log('ERROR at fetchContent 1>> ' + error);
        }
        console.log(`fullDay >> ${fullDay}`)
        await fetch(configToken.WebService + '/ECommerce', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'GetProject',
                'BPAPUS-PARAM':
                    '{"SHWJ_GUID": "' +
                    ProjList.SHWJH_GUID +
                    '","SHWJ_IMAGE": "N", "SHWL_IMAGE": "N"}',
                'BPAPUS-FILTER': '',
                'BPAPUS-ORDERBY': 'ORDER BY SHWLH_CODE',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '0',
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                console.log(json.ReasonString)
                if (json.ResponseCode == 200) {
                    let tempArray = [];
                    let responseData = JSON.parse(json.ResponseData);
                    console.log(`\n\rresponseData.SHOWLAYOUT [${responseData.SHOWLAYOUT.length}]`)
                    let temp_data = {
                        BANNER: null,
                        NOTI: null,
                        CATEGORY: null,
                        PROMOTION: null,
                        NEWPRODUCT: null,
                        ACTIVITY: null,
                        MYCARD: null,
                        DOCINFO: null,

                    }
                    for (const iterator of responseData.SHOWLAYOUT) {
                        let SHWLH_CODE = iterator.SHWLH_CODE
                        if (SHWLH_CODE.includes('BANNER')) {
                            temp_data.BANNER = iterator
                        } else if (SHWLH_CODE.includes('NOTI')) {
                            temp_data.NOTI = iterator
                        } else if (SHWLH_CODE.includes('CATEGORY')) {
                            temp_data.CATEGORY = iterator
                        } else if (SHWLH_CODE.includes('PROMOTION')) {
                            temp_data.PROMOTION = iterator
                        } else if (SHWLH_CODE.includes('NEWPRODUCT')) {
                            temp_data.NEWPRODUCT = iterator
                        } else if (SHWLH_CODE.includes('ACTIVITY')) {
                            temp_data.ACTIVITY = iterator
                        } else if (SHWLH_CODE.includes('MYCARD')) {
                            temp_data.MYCARD = iterator
                        } else if (SHWLH_CODE.includes('DOCINFO')) {
                            temp_data.DOCINFO = iterator
                        }
                    }
                    await Promise.allSettled([
                        fetchLayoutData('Banner', LoginList, temp_data.BANNER, fullDay),
                        fetchLayoutData('Notication', LoginList, temp_data.NOTI, fullDay),
                        fetchLayoutData('Category', LoginList, temp_data.CATEGORY, fullDay),
                        fetchLayoutData('Promotion', LoginList, temp_data.PROMOTION, fullDay),
                        fetchLayoutData('Newproduct', LoginList, temp_data.NEWPRODUCT, fullDay),
                        fetchLayoutData('Activity', LoginList, temp_data.ACTIVITY, fullDay),
                        fetchLayoutData('Mycard', LoginList, temp_data.MYCARD, fullDay),
                        fetchLayoutData('Docinfo', LoginList, temp_data.DOCINFO, fullDay),
                    ])



                } else {
                    CState = false
                    console.log('Function Parameter Required');
                    let temp_error = 'error_ser.' + json.ResponseCode;
                    console.log('>> ', temp_error)
                    Alert.alert(
                        Language.t('alert.errorTitle'),
                        Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => BackHandler.exitApp() }])
                }

            })
            .catch((error) => {
                console.error('FetchDataProject >> ' + error);
                CState = false
                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => BackHandler.exitApp() }])

            })
    }

    const fetchLayoutData = async (LayoutKey: String, LoginList: object, LayoutList: object, fullDay: any) => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        console.log(`fetchLayoutData ${LayoutKey} >> ${LayoutList.SHWLH_GUID}`)
        await fetch(configToken.WebService + '/ECommerce', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'GetLayout',
                'BPAPUS-PARAM':
                    '{"SHWL_GUID": "' +
                    LayoutList.SHWLH_GUID +
                    '","SHWL_IMAGE": "N", "SHWP_IMAGE": "N"}',
                'BPAPUS-FILTER': '',
                'BPAPUS-ORDERBY': '',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH':LayoutKey == 'Banner' || LayoutKey == 'Notication' ? '0' :  LayoutKey == 'Category' ? '10' : '3',
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                if (json.ResponseCode == 200) {
                    let responseData = JSON.parse(json.ResponseData);
                    if (LayoutKey == 'Banner') {

                        await dispatch(updateBannerList(responseData.SHOWLAYOUT))

                        await dispatch(updateBannerPage(
                            await fetchPageiItem(LayoutKey, LoginList, responseData.SHOWPAGE.sort((a: any, b: any) => {
                                return b.SHWLD_SEQ - a.SHWLD_SEQ;
                            }), fullDay)))
                    }
                    if (LayoutKey == 'Notication') {
                        await dispatch(updateNotificationList(responseData.SHOWLAYOUT))
                        await dispatch(updateNotificationPage(
                            await fetchPageiItem(LayoutKey, LoginList, responseData.SHOWPAGE.sort((a: any, b: any) => {
                                return b.SHWLD_SEQ - a.SHWLD_SEQ;
                            }), fullDay)))

                    }
                    if (LayoutKey == 'Category') {
                        await dispatch(updateCategoryList(responseData.SHOWLAYOUT))
                        await dispatch(updateCategoryPage(
                            await fetchPageiItem(LayoutKey, LoginList, responseData.SHOWPAGE, fullDay
                            )))
                    }
                    if (LayoutKey == 'Docinfo') {

                        await dispatch(updateDocinfoList(responseData.SHOWLAYOUT))
                        await dispatch(updateDocinfoPage(await fetchDocType(LoginList, responseData.SHOWPAGE)))
                    }
                    if (LayoutKey == 'Promotion') {
                        await dispatch(updatePromotionList(responseData.SHOWLAYOUT))
                        await dispatch(updatePromotionPage(
                            await fetchPageiItem(LayoutKey, LoginList, responseData.SHOWPAGE.sort((a: any, b: any) => {
                                return b.SHWLD_SEQ - a.SHWLD_SEQ;
                            }), fullDay)))

                    }
                    if (LayoutKey == 'Activity') {
                        await dispatch(updateActivityList(responseData.SHOWLAYOUT))
                        await dispatch(updateActivityPage(responseData.SHOWPAGE))
                    }
                    if (LayoutKey == 'Mycard') {
                        await dispatch(updateMycardList(responseData.SHOWLAYOUT))
                        await dispatch(updateMycardPage(responseData.SHOWPAGE))
                    }
                    if (LayoutKey == 'Newproduct') {
                        await dispatch(updateNewproductList(responseData.SHOWLAYOUT))
                        await dispatch(updateNewproductPage(responseData.SHOWPAGE))
                        await fetchProductContent('Newproduct', LoginList, responseData.SHOWPAGE[0])
                    }

                    //    console.log(responseData)
                } else {
                    CState = false
                    console.log('Function Parameter Required');
                    let temp_error = 'error_ser.' + json.ResponseCode;
                    console.log('>> ', temp_error)
                    Alert.alert(
                        Language.t('alert.errorTitle'),
                        Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => BackHandler.exitApp() }])
                }
            })
            .catch((error) => {
                console.error('GetLayout >> ' + error);
                CState = false
                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => BackHandler.exitApp() }])

            })
    }
    const fetchDocType = async (LoginList: Object, SHOWLAYOUT: any) => {
        console.log(`fetchDocType SHOWLAYOUT >.${JSON.stringify(SHOWLAYOUT)}`)
        let LAYOUTDATA = SHOWLAYOUT
        let DT_DOCCODE = SHOWLAYOUT[0].SHWPH_TTL_ECPTN

        console.log(`GetARinfo`)
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null

        await fetch(configToken.WebService + '/LookupErp', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'Dc000110',
                'BPAPUS-PARAM': '',
                'BPAPUS-FILTER': `AND ( DT_DOCCODE = '${DT_DOCCODE}' )`,
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
                    responseData.Dc000110[0].SHWPH_TTL_CPTN = LAYOUTDATA[0].SHWPH_TTL_CPTN
                    LAYOUTDATA[0] = responseData.Dc000110[0]

                } else {
                    Alert.alert(Language.t('notiAlert.header'), `${json.ReasonString}`, [
                        { text: Language.t('alert.confirm'), onPress: () => BackHandler.exitApp() }])
                }
            })
            .catch((error) => {
                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => BackHandler.exitApp() }])
                console.log('ERROR ' + error);
            })
        return LAYOUTDATA
    }
    const fetchProductContent = async (LayoutKey: String, LoginList: object, PageList: object) => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        console.log(`fetchNewproductContent ${JSON.stringify(PageList.SHWPH_GUID)}`)
        await fetch(configToken.WebService + '/ECommerce', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'GetPage',
                'BPAPUS-PARAM':
                    '{"SHWP_GUID": "' +
                    PageList.SHWPH_GUID +
                    '","SHWP_IMAGE": "N", "SHWC_IMAGE": "N"}',
                'BPAPUS-FILTER': '',
                'BPAPUS-ORDERBY': '',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '5',
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                if (json.ResponseCode == 200) {
                    let responseData = JSON.parse(json.ResponseData);
                    console.log(responseData.SHOWPAGE.RECORD_COUNT)
                    await dispatch(updateNewproductContent(responseData.SHOWCONTENT))

                } else {
                    CState = false
                    console.log('Function Parameter Required');
                    let temp_error = 'error_ser.' + json.ResponseCode;
                    console.log('>> ', temp_error)
                    Alert.alert(
                        Language.t('alert.errorTitle'),
                        Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => BackHandler.exitApp() }])
                }

            })
            .catch((error) => {
                console.error('GetLayout >> ' + error);
                CState = false
                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => BackHandler.exitApp() }])

            })

    }
    const fetchPageiItem = async (PageKey: String, LoginList: object, PageList: any, fullDay: string) => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        let SHOWPAGE: any[] = []
        let SP_IMAGE = "N"
        if (PageKey == 'Banner') SP_IMAGE = "Y"
        for (var i in PageList) {
            await fetch(configToken.WebService + '/ECommerce', {
                method: 'POST',
                body: JSON.stringify({
                    'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                    'BPAPUS-LOGIN-GUID': LoginList.BPAPUS_GUID,
                    'BPAPUS-FUNCTION': 'GetPage',
                    'BPAPUS-PARAM':
                        '{"SHWP_GUID": "' +
                        PageList[i].SHWPH_GUID +
                        '","SHWP_IMAGE" : "' + SP_IMAGE +
                        '","SHWC_IMAGE" : "' + SP_IMAGE +
                        '"}',
                    'BPAPUS-FILTER': '',
                    'BPAPUS-ORDERBY': '',
                    'BPAPUS-OFFSET': '0',
                    'BPAPUS-FETCH': '0',
                }),
            })
                .then((response) => response.json())
                .then(async (json) => {
                    if (json.ResponseCode == 200) {
                        let responseData = JSON.parse(json.ResponseData);
                        if (responseData.SHOWPAGE) {
                            if (PageKey == 'Category') {
                                responseData.SHOWPAGE.IMAGE64 = true
                                await SHOWPAGE.push(responseData.SHOWPAGE)
                            } else {
                                if (responseData.SHOWPAGE.SHWPH_FROM_DATE <= fullDay && fullDay <= responseData.SHOWPAGE.SHWPH_TO_DATE) {

                                    if (PageKey != 'Banner') responseData.SHOWPAGE.IMAGE64 = true
                                    await SHOWPAGE.push(responseData.SHOWPAGE)
                                }
                            }

                        }
                    } else {
                        CState = false
                        console.log('Function Parameter Required');
                        let temp_error = 'error_ser.' + json.ResponseCode;
                        console.log('>> ', temp_error)
                        Alert.alert(
                            Language.t('alert.errorTitle'),
                            Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => BackHandler.exitApp() }])

                    }

                })
                .catch((error) => {
                    console.error('GetLayout >> ' + error);
                    CState = false
                    Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                        { text: Language.t('alert.confirm'), onPress: () => BackHandler.exitApp() }])

                })


        }
        return SHOWPAGE


    }
    const setnotiItem = async () => {
        try {
            const value = await AsyncStorage.getItem('noti')

            if (value !== null) {

                // value previously stored
            } else {
                await AsyncStorage.setItem('noti', '0')
            }
        } catch (e) {
            await AsyncStorage.setItem('noti', '0')
        }
    }

    return (
        <>
            <SafeAreaView style={{
                backgroundColor: Colors.backgroundLoginColor,
                flex: 1,
                flexDirection: 'column',
            }} >

                <ScrollView>
                    <KeyboardAvoidingView keyboardVerticalOffset={1} behavior={'position'}>
                        <Image
                            style={{
                                width: undefined,
                                height: deviceWidth / 2,
                                justifyContent: 'center',
                                marginTop: deviceWidth / 4
                            }}
                            resizeMode={'contain'}
                            source={require('../img/2.5.png')}
                        />
                    </KeyboardAvoidingView>
                </ScrollView>
            </SafeAreaView>
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

        </>
    )
}

export default SpaceScreen;
