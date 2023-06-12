

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
import { config, updateUserList, updateMB_LOGIN_GUID, clearUserList, updateLoginList, clearLoginList } from '../store/slices/configReducer';
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
// import { Language, changeLanguage } from '../src/translations/I18n';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const MyConfig = '/config.json'; 
let CState = true
const SpaceScreen = () => {
    const dispatch = useAppDispatch();
    const ConfigList = useAppSelector(config)
    const projList = useAppSelector(projSelector)
    let images: Array<[]> = [];
    const navigation = useNavigation();

    useEffect(() => {
        if (CState)
            loadFuntion()
        else RNRestart.restart()
    }, []);

    const loadFuntion = async () => {
        // dispatch(updateConfigList())

        if (CState) await setConfig()
        if (CState) await UnRegister()
        if (CState) await Register()
        if (CState) await fetchGuidLog()
        if (CState) await setnotiItem()
        if (CState)
            navigation.navigate('bstab')
        //  navigation.dispatch(
        //     navigation.replace('bstab')
        // )

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
        return mac && mac.length > 0 && mac !== "02:00:00:00:00:00" && typeof(mac) !== 'object';
    };
    
    const isValidDeviceId = (deviceId) => {
        return deviceId && deviceId.length > 0 && deviceId !== "02:00:00:00:00:00" && typeof(deviceId) !== 'object';
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
            "WebService": "http://192.168.0.110:8907/Member/BplusErpDvSvrIIS.dll",
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
            "upDateVsersion": "3.0.3"
        }
        console.log(` JSON.stringify(superObj) ${ JSON.stringify(superObj.Mac)}`)
        if (configToken == null || configToken.upDateVsersion != superObj.upDateVsersion) {
            console.log(`new Obj >>`)
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
            .then((json) => {
                console.log(json.ReasonString)
                console.log(json.ReasonString)
                if (json && json.ResponseCode == '200') {
                }
            }
            )
            .catch((error) => {
                console.log(error)
                CState = false
                Alert.alert(`แจ้งเตือน`, `${error}`, [
                    { text: `ยืนยัน`, onPress: () => BackHandler.exitApp() }])
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

                } else {
                    console.log('Function Parameter Required');
                    let temp_error = 'error_ser.' + json.ResponseCode;
                    console.log('>> ', json)
                    CState = false
                    Alert.alert(`แจ้งเตือน`, `${json.ReasonString}`, [
                        { text: `ยืนยัน`, onPress: () => BackHandler.exitApp() }])
                }
            })
            .catch((error) => {
                console.log('ERROR ' + error);
                CState = false
                Alert.alert(`แจ้งเตือน`, `${error}`, [
                    { text: `ยืนยัน`, onPress: () => BackHandler.exitApp() }])

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
                    await dispatch(updateLoginList(responseData))
                    await getProJ(responseData)
                    console.log(`configToken.logined >> [${configToken.logined}]`)
                    if (configToken.logined == 'true') {
                        await getLoginMbUsers(responseData)
                    }
                } else {
                    console.log('Function Parameter Required');
                    let temp_error = 'error_ser.' + json.ResponseCode;
                    console.log('>> ', temp_error)
                    CState = false
                    Alert.alert(`แจ้งเตือน`, `${json.ReasonString}`, [
                        { text: `ยืนยัน`, onPress: () => BackHandler.exitApp() }])
                }
            })
            .catch((error) => {
                console.log('ERROR ' + error);
                if (configToken.WebService == '') {
                } else {

                }
                CState = false
                Alert.alert(`แจ้งเตือน`, `${error}`, [
                    { text: `ยืนยัน`, onPress: () => BackHandler.exitApp() }])
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
                    Alert.alert(`แจ้งเตือน`, `${json.ReasonString}`, [
                        { text: `ยืนยัน`, onPress: () => console.log() }])
                }
            })
            .catch((error) => {
                Alert.alert(`แจ้งเตือน`, `${error}`, [
                    { text: `ยืนยัน`, onPress: () => console.log() }])
                console.log('ERROR ' + error);
            })
    }

    const getMemberInfo = async (LoginList: Object, MB_LOGIN_GUID: any) => {
        console.log(`getProJ [Ec000400]`)
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
                    await dispatch(updateUserList(responseData.ShowMemberInfo[0]))
                    await dispatch(updateMB_LOGIN_GUID(MB_LOGIN_GUID))
                    const NewKey = { ...configToken, Phone: configToken.Phone, MB_PW: configToken.MB_PW, logined: 'true' }
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
            })
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
                        await dispatch(updateProjList(responseData.Ec000400[0]))
                        await FetchDataProject(LoginList, responseData.Ec000400[0])
                    } else {
                        CState = false
                        Alert.alert(`แจ้งเตือน`, `ไม่พบโครงการ`, [
                            { text: `ยืนยัน`, onPress: () => BackHandler.exitApp() }])
                    }
                } else {
                    CState = false
                    Alert.alert(`แจ้งเตือน`, `${json.ReasonString}`, [
                        { text: `ยืนยัน`, onPress: () => BackHandler.exitApp() }])
                }
            })
            .catch((error) => {
                CState = false
                Alert.alert(`แจ้งเตือน`, `${error}`, [
                    { text: `ยืนยัน`, onPress: () => BackHandler.exitApp() }])
                console.log('ERROR ' + error);
            })
    }

    const FetchDataProject = async (LoginList: object, ProjList: object) => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        console.log(`FetchDataProject`)
        await fetch(configToken.WebService + '/ECommerce', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'GetProject',
                'BPAPUS-PARAM':
                    '{"SHWJ_GUID": "' +
                    ProjList.SHWJH_GUID +
                    '","SHWJ_IMAGE": "Y", "SHWL_IMAGE": "Y"}',
                'BPAPUS-FILTER': '',
                'BPAPUS-ORDERBY': '',
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

                    let Banner = await responseData.SHOWLAYOUT.filter((filteritem: any) => { return filteritem.SHWLH_CODE.includes('BANNER') })[0]
                    console.log(`\nBanner [${Banner ? true : false}]\n +> `)
                    Banner && await fetchLayoutData('Banner', LoginList, Banner)

                    let Notication = await responseData.SHOWLAYOUT.filter((filteritem: any) => { return filteritem.SHWLH_CODE.includes('NOTI') })[0]
                    console.log(`\nNotication [${Notication ? true : false}]\n +> `)
                    Notication && await fetchLayoutData('Notication', LoginList, Notication)

                    let Category = await responseData.SHOWLAYOUT.filter((filteritem: any) => { return filteritem.SHWLH_CODE.includes('CATEGORY') })[0]
                    console.log(`\nCategory [${Category ? true : false}]\n +>`)
                    Category && await fetchLayoutData('Category', LoginList, Category)

                    let Promotion = await responseData.SHOWLAYOUT.filter((filteritem: any) => { return filteritem.SHWLH_CODE.includes('PROMOTION') })[0]
                    console.log(`\nPromotion [${Promotion ? true : false}]\n +> `)
                    Promotion && await fetchLayoutData('Promotion', LoginList, Promotion)

                    let Newproduct = await responseData.SHOWLAYOUT.filter((filteritem: any) => { return filteritem.SHWLH_CODE.includes('NEWPRODUCT') })[0]
                    console.log(`\nPromotion [${Newproduct ? true : false}]\n +> `)
                    Newproduct && await fetchLayoutData('Newproduct', LoginList, Newproduct)

                    let Activity = await responseData.SHOWLAYOUT.filter((filteritem: any) => { return filteritem.SHWLH_CODE.includes('ACTIVITY') })[0]
                    console.log(`\nActivity [${Activity ? true : false}]\n +> `)
                    Activity && await fetchLayoutData('Activity', LoginList, Activity)

                    let Mycard = await responseData.SHOWLAYOUT.filter((filteritem: any) => { return filteritem.SHWLH_CODE.includes('MYCARD') })[0]
                    console.log(`\nMycard [${Mycard ? true : false}]\n +> `)
                    Mycard && await fetchLayoutData('Mycard', LoginList, Mycard)

                    let Docinfo = await responseData.SHOWLAYOUT.filter((filteritem: any) => { return filteritem.SHWLH_CODE.includes('DOCINFO') })[0]
                    console.log(`\nDocinfo [${Docinfo ? true : false}]\n +> `)
                    Docinfo && await fetchLayoutData('Docinfo', LoginList, Docinfo)
                } else {
                    CState = false
                    Alert.alert(`แจ้งเตือน`, `${json.ReasonString}`, [
                        { text: `ยืนยัน`, onPress: () => BackHandler.exitApp() }])
                }

            })
            .catch((error) => {
                console.error('FetchDataProject >> ' + error);
                CState = false
                Alert.alert(`แจ้งเตือน`, `${error}`, [
                    { text: `ยืนยัน`, onPress: () => BackHandler.exitApp() }])

            })
    }

    const fetchLayoutData = async (LayoutKey: String, LoginList: object, LayoutList: object) => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        console.log(`fetchLayoutData ${LayoutKey}`)
        await fetch(configToken.WebService + '/ECommerce', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'GetLayout',
                'BPAPUS-PARAM':
                    '{"SHWL_GUID": "' +
                    LayoutList.SHWLH_GUID +
                    '","SHWL_IMAGE": "Y", "SHWP_IMAGE": "Y"}',
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
                    if (LayoutKey == 'Banner') {
                        await responseData.SHOWPAGE.sort((a: any, b: any) => {
                            return a.SHWLD_SEQ - b.SHWLD_SEQ;
                        }).map((Banneritem: any) => {
                            let objImage: any = {
                                image: `data:image/png;base64,${Banneritem.IMAGE64}`
                            }
                            images.push(objImage)
                        })
                        await dispatch(updateBannerList(responseData.SHOWLAYOUT))
                        await dispatch(updateBannerPage(responseData.SHOWPAGE))
                    }
                    if (LayoutKey == 'Notication') {
                        await dispatch(updateNotificationList(responseData.SHOWLAYOUT))
                        await dispatch(updateNotificationPage(responseData.SHOWPAGE))
                    }
                    if (LayoutKey == 'Category') {
                        await dispatch(updateCategoryList(responseData.SHOWLAYOUT))
                        let tempdata = await getProducrALLCategory(responseData.SHOWPAGE, LoginList)
                        await dispatch(updateAllproductList(tempdata.sort((a: any, b: any) => {
                            return a.GOODS_CODE - b.GOODS_CODE;
                        })))
                        let tempCPTNC = await getPageProJ(responseData.SHOWPAGE, LoginList)
                        await dispatch(updateCategoryPage(tempCPTNC))

                    }
                    if (LayoutKey == 'Docinfo') {
                        await dispatch(updateDocinfoList(responseData.SHOWLAYOUT))
                        await dispatch(updateDocinfoPage(responseData.SHOWPAGE))
                    }
                    if (LayoutKey == 'Promotion') {
                        await dispatch(updatePromotionList(responseData.SHOWLAYOUT))
                        await dispatch(updatePromotionPage(responseData.SHOWPAGE))
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
                        await fetchPageData('Newproduct', LoginList, responseData.SHOWPAGE[0])
                    }

                    //    console.log(responseData)
                } else {
                    CState = false
                    Alert.alert(`แจ้งเตือน`, `${json.ReasonString}`, [
                        { text: `ยืนยัน`, onPress: () => BackHandler.exitApp() }])
                }
            })
            .catch((error) => {
                console.error('GetLayout >> ' + error);
                CState = false
                Alert.alert(`แจ้งเตือน`, `${error}`, [
                    { text: `ยืนยัน`, onPress: () => BackHandler.exitApp() }])

            })
    }

    const fetchPageData = async (PageKey: String, LoginList: object, PageList: object) => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        console.log(`fetchPageData ${PageList}`)
        await fetch(configToken.WebService + '/ECommerce', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'GetPage',
                'BPAPUS-PARAM':
                    '{"SHWP_GUID": "' +
                    PageList.SHWPH_GUID +
                    '","SHWP_IMAGE": "Y", "SHWC_IMAGE": "Y"}',
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
                    if (PageKey == 'Newproduct') {
                        await dispatch(updateNewproductContent(responseData.SHOWCONTENT))
                    } else if (PageKey == 'Category') {
                        return responseData.SHOWCONTENT[0]
                    }
                    //console.log(responseData)
                } else {
                    CState = false
                    Alert.alert(`แจ้งเตือน`, `${json.ReasonString}`, [
                        { text: `ยืนยัน`, onPress: () => BackHandler.exitApp() }])
                }

            })
            .catch((error) => {
                console.error('GetLayout >> ' + error);
                CState = false
                Alert.alert(`แจ้งเตือน`, `${error}`, [
                    { text: `ยืนยัน`, onPress: () => BackHandler.exitApp() }])

            })
    }
    const getPageProJ = async (categoryList: any, LoginList: object,) => {

        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        let tempProductList: any = []
        for (var r in categoryList) {
            console.log(`[${r + 1}] ${categoryList[r].SHWPH_GUID}`)
            await fetch(configToken.WebService + '/ECommerce', {
                method: 'POST',
                body: JSON.stringify({
                    'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                    'BPAPUS-LOGIN-GUID': LoginList.BPAPUS_GUID,
                    'BPAPUS-FUNCTION': 'GetPage',
                    'BPAPUS-PARAM':
                        '{"SHWP_GUID": "' +
                        categoryList[r].SHWPH_GUID +
                        '","SHWP_IMAGE": "Y", "SHWC_IMAGE": "Y"}',
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
                            console.log(`responseData > ${responseData.SHOWPAGE}`)
                            tempProductList.push(responseData.SHOWPAGE)

                        }
                    } else {
                        Alert.alert(`แจ้งเตือน`, `${json.ReasonString}`, [
                            { text: `ยืนยัน`, onPress: () => console.log() }])
                    }
                    console.log(`[${json.ResponseCode}] ${json.ReasonString}`)

                })
                .catch((error) => {
                    Alert.alert(`แจ้งเตือน`, `${error}`, [
                        { text: `ยืนยัน`, onPress: () => console.log() }])
                    console.log('ERROR ' + error);
                })
            console.log()

        }

        console.log(`end getProducrALLCategory`)
        return tempProductList
    }

    const getProducrALLCategory = async (categoryList: any, LoginList: object,) => {

        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        let tempProductList: any = []
        for (var r in categoryList) {
            console.log(`[${r + 1}] ${categoryList[r].SHWPH_GUID}`)
            await fetch(configToken.WebService + '/ECommerce', {
                method: 'POST',
                body: JSON.stringify({
                    'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                    'BPAPUS-LOGIN-GUID': LoginList.BPAPUS_GUID,
                    'BPAPUS-FUNCTION': 'GetPage',
                    'BPAPUS-PARAM':
                        '{"SHWP_GUID": "' +
                        categoryList[r].SHWPH_GUID +
                        '","SHWP_IMAGE": "Y", "SHWC_IMAGE": "Y"}',
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
                        if (responseData.SHOWCONTENT) {
                            await responseData.SHOWCONTENT.map((tempItem: any) => {
                                tempProductList.push(tempItem)
                            })
                        }
                    } else {
                        Alert.alert(`แจ้งเตือน`, `${json.ReasonString}`, [
                            { text: `ยืนยัน`, onPress: () => console.log() }])
                    }
                    console.log(`[${json.ResponseCode}] ${json.ReasonString}`)

                })
                .catch((error) => {
                    Alert.alert(`แจ้งเตือน`, `${error}`, [
                        { text: `ยืนยัน`, onPress: () => console.log() }])
                    console.log('ERROR ' + error);
                })
            console.log()

        }

        console.log(`end getProducrALLCategory`)
        return tempProductList
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

        </>
    )
}

const styles = StyleSheet.create({
    container1: {

        flex: 1,

    },
    body: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        width: deviceWidth * 2,
        borderRadius: 15,
        backgroundColor: Colors.backgroundColorSecondary
    },
    body1e: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: 'flex-end'
    },
    body1: {
        marginTop: 20,
        flexDirection: "row",
    },
    tabbar: {
        height: FontSize.large * 3,
        paddingTop: deviceWidth * 0.03,
        paddingLeft: deviceWidth * 0.03,
        paddingRight: deviceWidth * 0.03,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    footer: {
        position: 'absolute',

        justifyContent: 'center',
        flexDirection: "row",

        left: 0,
        top: deviceHeight - deviceHeight * 0.1,
        width: deviceWidth,
    },
    table: {

    },
    tableView: {


        paddingLeft: 10,
        paddingRight: 10,

        flexDirection: "row",

    },
    tableHeader: {
        borderTopLeftRadius: 15,
        borderTopEndRadius: 15,

        flexDirection: "row",
        backgroundColor: Colors.buttonColorPrimary,

    },
    dorpdown: {
        justifyContent: 'center',
        fontSize: FontSize.medium,
    },
    dorpdownTop: {
        justifyContent: 'flex-end',
        fontSize: FontSize.medium,
    },
    textTitle: {
        paddingRight: deviceWidth * 0.07,
        fontSize: FontSize.medium,
        fontWeight: 'bold',
        color: '#ffff',
    },
    image: {
        flex: 1,
        paddingTop: deviceHeight * 0.2

    },
    topImage: {
        height: deviceHeight / 3,
        width: deviceWidth,

    },
    imageIcon: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    button: {
        marginTop: 10,
        marginBottom: 25,
        padding: 5,
        alignItems: 'center',
        backgroundColor: Colors.buttonColorPrimary,
        borderRadius: 10,
    },
    textButton: {
        fontSize: FontSize.large,
        color: Colors.fontColor2,
    },
    buttonContainer: {
        marginTop: 10,
    },
    checkboxContainer: {
        flexDirection: "row",
        marginLeft: 10,
        marginBottom: 20,
    },
    checkbox: {
        alignSelf: "center",
        borderBottomColor: '#ffff',
        color: '#f fff',
    },
    label: {
        margin: 8,
        color: '#ffff',
    },
});

export default SpaceScreen;
