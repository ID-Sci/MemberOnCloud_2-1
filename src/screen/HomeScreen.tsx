

import React, { useRef, useState, useEffect } from 'react';

import {
    ActivityIndicator,
    Animated,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    Dimensions,
    Text,
    BackHandler,
    Image,
    RefreshControl,
    Alert,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { FontSize } from '../styles/FontSizeHelper';
import FlatSlider from '../components/FlatListSlider';
import FlatListCategory from '../components/FlatListCategory';
import FlatListPromotion from '../components/FlatListPromotion';
import FlatListNewproduct from '../components/FlatListNewproduct';
import FlatListActivity from '../components/FlatListActivity';
import RNRestart from 'react-native-restart';
import * as Keychain from 'react-native-keychain';



import AsyncStorage from '@react-native-async-storage/async-storage';
import { config, updateUserList, updateMB_LOGIN_GUID, clearUserList, updateLoginList, clearLoginList } from '../store/slices/configReducer';
import { newproductSelector } from '../store/slices/newproductReducer';
import { docinfoSelector, updateDocinfoList, clearDocinfoList, updateDocinfoPage, clearDocinfoPage } from '../store/slices/docinfoReducer';
import { projSelector, updateProjList, clearProjList } from '../store/slices/projReducer';
import { promotionSelector, updatePromotionList, clearPromotionList, updatePromotionPage, clearPromotionPage } from '../store/slices/promotionReducer';
import { updateNotificationList, clearNotificationList, updateNotificationPage, clearNotificationPage, notificationSelector } from '../store/slices/notificationReducer';
import { categorySelector, updateCategoryList, clearCategoryList, updateCategoryPage, clearCategoryPage } from '../store/slices/categoryReducer';
import { bannerSelector, updateBannerList, clearBannerList, updateBannerPage, clearBannerPage } from '../store/slices/bannerReducer';
import { activitySelector, updateActivityList, clearActivityList, updateActivityPage, clearActivityPage } from '../store/slices/activityReducer';
import { mycardSelector, updateMycardList, clearMycardList, updateMycardPage, clearMycardPage } from '../store/slices/mycardReducer';
import { newproductSlice, updateNewproductList, updateAllproductList, clearAllproductList, clearnewproductList, updateNewproductPage, clearNewproductPage, updateNewproductContent, clearNewproductContent } from '../store/slices/newproductReducer';
import { useAppDispatch, useAppSelector } from '../store/store';
import { Language, changeLanguage } from '../translations/I18n';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
let images: Array<[]> = []
let CState = true
const HomeScreen = ({ route }: any) => {
    const [product, setProduct] = useState([])
    const navigation = useNavigation();

    const categoryList = useAppSelector(categorySelector)
    const promotionList = useAppSelector(promotionSelector)
    const bannerList = useAppSelector(bannerSelector)
    const newproductList = useAppSelector(newproductSelector)
    const activityList = useAppSelector(activitySelector)
    const notificationList = useAppSelector(notificationSelector)
    const ConfigList = useAppSelector(config)
    const [OnScrollIndex, setOnScrollIndex] = useState(0)
    const [notivalue, setNotivalue] = useState(AsyncStorage.getItem('noti') == null ? '0' : AsyncStorage.getItem('noti'))
    const [headerShown, setHeaderShown] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const scrolling = useRef(new Animated.Value(0)).current;
    const translation = scrolling.interpolate({
        inputRange: [0, 80],
        outputRange: [-100, 0],
        extrapolate: 'clamp',
    });

    const dispatch = useAppDispatch();
    useEffect(() => {
        getNotiData()
    }, [])

    useEffect(() => {

        const intervalId = setInterval(() => {
            decrementClock();
        }, 1000);
        return () => {
            clearInterval(intervalId);
        }
    })

    const decrementClock = async () => {
        if (timeLeft === 0) {
            await setTimeLeft(60);
            await getProJ()
        } else {
            await setTimeLeft(timeLeft - 1);
        }
    }

    const getNotiData = async () => {
        try {
            const value = await AsyncStorage.getItem('noti')
            if (value !== null) {
                setNotivalue(value)
                // value previously stored
            }
        } catch (e) {
            // error reading value
        }

    }
    const setNotiData = async () => {
        console.log(notificationList.notificationPage.length.toString())
        await AsyncStorage.setItem('noti', notificationList.notificationPage.length.toString())
        await setNotivalue(notificationList.notificationPage.length.toString())
        await navigation.navigate('ShowTemppage' as never, { name: Language.t('notiAlert.header'), route: notificationList.notificationPage } as never)
    }
    const getProducrCategory = async (item: any) => {
        navigation.navigate('ProductCategory' as never, { name: Language.t('product.category'), route: item } as never)
    }

    const onRefresh = async () => {
        await setRefreshing(true);
        await getProJ()
        await getNotiData()
        console.log(`reloade completed`)

        await setRefreshing(false);
    };

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
                    await getMemberInfo(responseData.MB_LOGIN_GUID)
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
                    const NewKey = { ...configToken, Phone: configToken.Phone, MB_PW: configToken.MB_PW, logined: 'true' }
                    await Keychain.setGenericPassword("config", JSON.stringify(NewKey))
                } else if (json.ResponseCode == 610) RNRestart.restart()
                else {
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

    const getProJ = async () => {
        console.log(`getProJ [Ec000400]`)
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        await setTimeLeft(60);
        await fetch(configToken.WebService + '/ECommerce', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
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
                        await FetchDataProject(responseData.Ec000400[0])
                        if (configToken.logined == 'true') {
                            await getLoginMbUsers()
                        }
                    } else {
                        CState = false


                        console.log('Function Parameter Required');
                        let temp_error = 'error_ser.' + json.ResponseCode;
                        console.log('>> ', temp_error)
                        Alert.alert(
                            Language.t('alert.errorTitle'),
                            Language.t('error_ser.projectnotfound'), [{ text: Language.t('alert.ok'), onPress: () => BackHandler.exitApp() }])
                    }
                } else if (json.ResponseCode == 610) RNRestart.restart()
                else {
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
                CState = false
                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => BackHandler.exitApp() }])
                console.log('ERROR ' + error);
            })
        await setnotiItem()

    }

    const FetchDataProject = async (ProjList: any) => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        console.log(`FetchDataProject`)
        await fetch(configToken.WebService + '/ECommerce', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
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
                    Banner && await fetchLayoutData('Banner', Banner)

                    let Notication = await responseData.SHOWLAYOUT.filter((filteritem: any) => { return filteritem.SHWLH_CODE.includes('NOTI') })[0]
                    console.log(`\nNotication [${Notication ? true : false}]\n +> `)
                    Notication && await fetchLayoutData('Notication', Notication)

                    let Category = await responseData.SHOWLAYOUT.filter((filteritem: any) => { return filteritem.SHWLH_CODE.includes('CATEGORY') })[0]
                    console.log(`\nCategory [${Category ? true : false}]\n +>`)
                    Category && await fetchLayoutData('Category', Category)

                    let Promotion = await responseData.SHOWLAYOUT.filter((filteritem: any) => { return filteritem.SHWLH_CODE.includes('PROMOTION') })[0]
                    console.log(`\nPromotion [${Promotion ? true : false}]\n +> `)
                    Promotion && await fetchLayoutData('Promotion', Promotion)

                    let Newproduct = await responseData.SHOWLAYOUT.filter((filteritem: any) => { return filteritem.SHWLH_CODE.includes('NEWPRODUCT') })[0]
                    console.log(`\nPromotion [${Newproduct ? true : false}]\n +> `)
                    Newproduct && await fetchLayoutData('Newproduct', Newproduct)

                    let Activity = await responseData.SHOWLAYOUT.filter((filteritem: any) => { return filteritem.SHWLH_CODE.includes('ACTIVITY') })[0]
                    console.log(`\nActivity [${Activity ? true : false}]\n +> `)
                    Activity && await fetchLayoutData('Activity', Activity)

                    let Mycard = await responseData.SHOWLAYOUT.filter((filteritem: any) => { return filteritem.SHWLH_CODE.includes('MYCARD') })[0]
                    console.log(`\nMycard [${Mycard ? true : false}]\n +> `)
                    Mycard && await fetchLayoutData('Mycard', Mycard)

                    let Docinfo = await responseData.SHOWLAYOUT.filter((filteritem: any) => { return filteritem.SHWLH_CODE.includes('DOCINFO') })[0]
                    console.log(`\nDocinfo [${Docinfo ? true : false}]\n +> `)
                    Docinfo && await fetchLayoutData('Docinfo', Docinfo)
                } else if (json.ResponseCode == 610) RNRestart.restart()
                else {
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

    const fetchLayoutData = async (LayoutKey: String, LayoutList: any) => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        console.log(`fetchLayoutData ${LayoutKey}`)
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

        console.log(`fetchLayoutData ${LayoutKey}`)
        await fetch(configToken.WebService + '/ECommerce', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
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
                            return b.SHWLD_SEQ - a.SHWLD_SEQ;
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
                        await dispatch(updateNotificationPage(responseData.SHOWPAGE.sort((a: any, b: any) => {
                            return b.SHWLD_SEQ - a.SHWLD_SEQ;
                        })))
                    }
                    if (LayoutKey == 'Category') {
                        await dispatch(updateCategoryList(responseData.SHOWLAYOUT))
                        let tempdata = await getProducrALLCategory(responseData.SHOWPAGE)

                        await dispatch(updateAllproductList(tempdata.sort((a: any, b: any) => {
                            return a.GOODS_CODE - b.GOODS_CODE;
                        })))
                        let tempCPTNC = await getPageProJ(responseData.SHOWPAGE)
                        await dispatch(updateCategoryPage(tempCPTNC))

                    }
                    if (LayoutKey == 'Docinfo') {
                        await dispatch(updateDocinfoList(responseData.SHOWLAYOUT))
                        await dispatch(updateDocinfoPage(responseData.SHOWPAGE))
                    }
                    if (LayoutKey == 'Promotion') {
                        await dispatch(updatePromotionList(responseData.SHOWLAYOUT))

                        await fetchPageiItem(LayoutKey, responseData.SHOWPAGE.sort((a: any, b: any) => {
                            return b.SHWLD_SEQ - a.SHWLD_SEQ;
                        }), fullDay)

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
                        await fetchNewproductContent('Newproduct', responseData.SHOWPAGE[0])
                    }

                    //    console.log(responseData)
                } else if (json.ResponseCode == 610) RNRestart.restart()
                else {
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

    const fetchNewproductContent = async (PageKey: String, PageList: any) => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        console.log(`fetchNewproductContent ${PageList}`)

        await fetch(configToken.WebService + '/ECommerce', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
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
                } else if (json.ResponseCode == 610) RNRestart.restart()
                else {
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

    const fetchPageiItem = async (PageKey: String, PageList: any, fullDay: string) => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        console.log(`fetchPageiItem ${fullDay}`)
        let SHOWPAGE: any[] = []
        for (var i in PageList) {
            console.log(`fetchPageiItem ${PageList[i].SHWPH_GUID} `)

            await fetch(configToken.WebService + '/ECommerce', {
                method: 'POST',
                body: JSON.stringify({
                    'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                    'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                    'BPAPUS-FUNCTION': 'GetPage',
                    'BPAPUS-PARAM':
                        '{"SHWP_GUID": "' +
                        PageList[i].SHWPH_GUID +
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
                            console.log(`${fullDay} => ${responseData.SHOWPAGE.SHWPH_FROM_DATE} && ${responseData.SHOWPAGE.SHWPH_TO_DATE} <= ${fullDay}`)
                            await SHOWPAGE.push(responseData.SHOWPAGE)
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
        if (PageKey == 'Promotion') {
            await dispatch(updatePromotionPage(SHOWPAGE.filter((filteritem: any) => { return fullDay >= filteritem.SHWPH_FROM_DATE && fullDay <= filteritem.SHWPH_TO_DATE })))
        } else if (PageKey == 'Category') {

        }
    }
    const getProducrALLCategory = async (categoryList: any,) => {

        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        let tempProductList: any = []
        for (var r in categoryList) {
            console.log(`[${r + 1}] ${categoryList[r].SHWPH_GUID}`)
            await fetch(configToken.WebService + '/ECommerce', {
                method: 'POST',
                body: JSON.stringify({
                    'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                    'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
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
                    } else if (json.ResponseCode == 610) RNRestart.restart()
                    else {
                        console.log('Function Parameter Required');
                        let temp_error = 'error_ser.' + json.ResponseCode;
                        console.log('>> ', temp_error)
                        Alert.alert(
                            Language.t('alert.errorTitle'),
                            Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => console.log() }])
                    }
                    console.log(`[${json.ResponseCode}] ${json.ReasonString}`)

                })
                .catch((error) => {
                    Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                        { text: Language.t('alert.confirm'), onPress: () => console.log() }])
                    console.log('ERROR ' + error);
                })


        }

        console.log(`end getProducrALLCategory`)
        return tempProductList
    }
    const getPageProJ = async (categoryList: any) => {

        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        let tempProductList: any = []
        for (var r in categoryList) {
            console.log(`[${r + 1}] ${categoryList[r].SHWPH_GUID}`)
            await fetch(configToken.WebService + '/ECommerce', {
                method: 'POST',
                body: JSON.stringify({
                    'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                    'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
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
                        console.log('Function Parameter Required');
                        let temp_error = 'error_ser.' + json.ResponseCode;
                        console.log('>> ', temp_error)
                        Alert.alert(
                            Language.t('alert.errorTitle'),
                            Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => console.log() }])
                    }
                    console.log(`[${json.ResponseCode}] ${json.ReasonString}`)

                })
                .catch((error) => {
                    Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                        { text: Language.t('alert.confirm'), onPress: () => console.log() }])
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
        <View  >
            <View style={{ width: deviceWidth, height: deviceHeight }}>


                <Animated.ScrollView

                    refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{ height: deviceHeight }}

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
                    <View >
                        <FlatSlider route={bannerList.bannerPage} />
                    </View>
                    <>
                        <FlatListCategory route={categoryList.categoryPage} onPressCategory={(item: any) => getProducrCategory(item)} />
                        <FlatListPromotion route={promotionList.promotionPage} />
                        <FlatListNewproduct backPage={'Home'} route={newproductList.newproductContent} />
                        <FlatListActivity route={activityList.activityPage} />
                    </>

                </Animated.ScrollView>
                {refreshing && (<View
                    style={{

                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'absolute',
                        height: deviceHeight * 0.3,
                        width: deviceWidth,
                        borderRadius: deviceWidth * 0.05
                    }}>
                    <View style={{
                        backgroundColor: Colors.borderColor,
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'absolute',
                        height: FontSize.large * 2,
                        width: FontSize.large * 2,
                        borderRadius: FontSize.large,
                        opacity: 0.5,

                    }}>
                        <ActivityIndicator animating={refreshing} size={FontSize.large} color="#0288D1" />
                    </View>

                </View>)}
            </View>
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 70,

                    backgroundColor: Colors.buttonTextColor,
                    opacity: scrolling,
                    transform: [
                        { translateY: translation },
                    ],

                }}
            />
            <View style={{
                width: deviceWidth,

                paddingTop: deviceWidth * 0.03,
                paddingBottom: deviceWidth * 0.03,
                paddingLeft: deviceWidth * 0.03,
                paddingRight: deviceWidth * 0.03,
                alignItems: 'center',
                position: 'absolute',
                justifyContent: 'space-between',
                flexDirection: 'row',

            }} >
                <TouchableOpacity style={{
                    backgroundColor: '#fff', alignSelf: 'center', width: deviceWidth * 0.8,
                    justifyContent: 'center', borderRadius: FontSize.large * 2, flexDirection: 'row',
                    alignItems: 'center',
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                }}
                    onPress={() => navigation.navigate('ProductSearch' as never, { name: Language.t('menu.search') } as never)}
                >
                    <View style={{ padding: 10 }}  >
                        <Image
                            source={require('../img/iconsMenu/search.png')}
                            style={{
                                width: FontSize.large,
                                height: FontSize.large,
                                resizeMode: 'contain',
                            }}
                        />
                    </View>
                    <Text
                        style={{
                            flex: 8,
                            borderBottomColor: Colors.borderColor,
                            color: Colors.fontColor,
                            fontFamily: 'Kanit',
                            fontSize: FontSize.medium,
                        }}
                    >
                        {`${Language.t('menu.search')} ` + '..'}
                    </Text>
                    <View style={{ padding: 10, }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Text style={{ fontFamily: 'Kanit', fontSize: FontSize.medium }}>{Language.t('menu.scan')}</Text>
                            <Image
                                source={require('../img/iconsMenu/barcode.png')}
                                style={{
                                    width: FontSize.large,
                                    height: FontSize.large,
                                    resizeMode: 'contain',
                                }}
                            />
                        </View>

                    </View>
                </TouchableOpacity>
                <View style={{
                    width: deviceWidth * 0.1
                }}>

                    <TouchableOpacity style={{
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,

                        elevation: 5,
                    }} onPress={() =>
                        setNotiData()}>

                        <Image
                            source={require('../img/iconsMenu/bell.png')}
                            style={{
                                width: FontSize.large * 1.5,
                                height: FontSize.large * 1.5,
                                resizeMode: 'contain',
                            }}
                        />
                        {(notificationList.notificationPage.length - Number(notivalue)) > 0 && (
                            <View style={{
                                width: FontSize.large,
                                height: FontSize.large,
                                borderRadius: FontSize.large,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'red',
                                marginLeft: 20,
                                position: 'absolute',
                            }}>
                                <Text style={{
                                    fontSize: FontSize.medium,
                                    color: '#fff',
                                    fontFamily: 'Kanit',
                                    fontWeight: 'bold'
                                }}>
                                    {notificationList.notificationPage.length - Number(notivalue)}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
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
        paddingTop: deviceHeight * 0.2,
        resizeMode: 'contain',

    },
    topImage: {
        height: deviceHeight / 3,
        width: deviceWidth,
        resizeMode: 'contain',
    },
    imageIcon: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'contain',
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

export default HomeScreen;
