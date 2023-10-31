

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
import { config, updateARcode, updateUserList, updateMB_LOGIN_GUID, clearUserList, updateLoginList, clearLoginList } from '../store/slices/configReducer';
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
import { styles, statusBarHeight, deviceWidth, deviceHeight } from '../styles/styles';
import RNFetchBlob from 'rn-fetch-blob';

let CState = true
const HomeScreen = ({ route }: any) => {
    const navigation = useNavigation();

    const projList = useAppSelector(projSelector)
    const categoryList = useAppSelector(categorySelector)
    const promotionList = useAppSelector(promotionSelector)
    const bannerList = useAppSelector(bannerSelector)
    const newproductList = useAppSelector(newproductSelector)
    const activityList = useAppSelector(activitySelector)
    const notificationList = useAppSelector(notificationSelector)
    const ConfigList = useAppSelector(config)
    const [OnScrollIndex, setOnScrollIndex] = useState(0)
    const [bannerData, setBannerData] = useState(bannerList.bannerPage)
    const [categoryData, setCategoryData] = useState(categoryList.categoryPage)
    const [promotionData, setPromotionData] = useState(promotionList.promotionPage)
    const [newproductData, setNewproductData] = useState(newproductList.newproductContent)
    const [activityData, setActivityData] = useState(activityList.activityPage)
    const [notificationData, setNotificationData] = useState(notificationList.notificationPage)

    const [notivalue, setNotivalue] = useState(AsyncStorage.getItem('noti') == null ? '0' : AsyncStorage.getItem('noti'))
    const [headerShown, setHeaderShown] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [product, setProduct] = useState(newproductList.allproductList)
    let ProducrALL: any[] = []
    const scrolling = useRef(new Animated.Value(0)).current;
    let CState = true
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
        FetchDataProject()
        getItemImage()
    }, [])
    useEffect(() => {

        const intervalId = setInterval(() => {
            decrementClock();
        }, 1000);
        return () => {
            clearInterval(intervalId);
        }
    })
    const getItemImage = async () => {
        await Promise.allSettled([
            // setBannerImage(),
            setCategoryImage(),
            setPromotionImage(),
            setActivityImage(),
            setNewproductImage(),
            setNotificationImage(),
            setProductImage()
        ])
    }
    // const setBannerImage = async () => {
    //     let tempBannerData = [];
    //     for (var i in bannerData) {
    //         const updatedBanner = { ...bannerData[i], IMAGE64: await getImagefile('ShowPage', bannerData[i]) };
    //         tempBannerData.push(updatedBanner);
    //     }
    //     setBannerData(tempBannerData);
    // }
    const setCategoryImage = async () => {
        let tempCategoryData: any[] = [];
        const settledPromises = await Promise.allSettled(categoryData.map(async (categoryItem) => {
            try {
                const IMAGE64 = await getImagefile('ShowPage', categoryItem);
                return { ...categoryItem, IMAGE64 };
            } catch (error) {
                return { ...categoryItem, IMAGE64: null, error: error.message };
            }
        }));
        
        settledPromises.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                tempCategoryData.push(result.value);
            } else {
                console.error(`Error fetching IMAGE64 for categoryData ${index}:`, result.reason);
            }
        });
        
        setCategoryData(tempCategoryData);
        
    }
    const setPromotionImage = async () => {
        let tempPromotionData: any[] = [];
        const settledPromises = await Promise.allSettled(promotionData.map(async (promotionItem) => {
            try {
                const IMAGE64 = await getImagefile('ShowPage', promotionItem);
                return { ...promotionItem, IMAGE64 };
            } catch (error) {
                return { ...promotionItem, IMAGE64: null, error: error.message };
            }
        }));
        
        settledPromises.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                tempPromotionData.push(result.value);
            } else {
                console.error(`Error fetching IMAGE64 for promotionData ${index}:`, result.reason);
            }
        });
        
        setPromotionData(tempPromotionData);
        dispatch(updatePromotionPage(tempPromotionData));
        
    }
    const setActivityImage = async () => {
        let tempActivityData: any[] = [];
        const settledPromises = await Promise.allSettled(activityData.map(async (activityItem) => {
            const IMAGE64 = await getImagefile('ShowPage', activityItem);
            return { ...activityItem, IMAGE64 };
        }));
        
        settledPromises.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                tempActivityData.push(result.value);
            } else {
                console.error(`Error fetching IMAGE64 for activityData ${index}:`, result.reason);
            }
        });
        
        setActivityData(tempActivityData);
        
    }
    const setNewproductImage = async () => {
        let tempNewproductData: any[] = [];
        const settledPromises = await Promise.allSettled(newproductData.map(async (newproductItem) => {
            const IMAGE64 = await getImagefile('ShowContent', newproductItem);
            return { ...newproductItem, IMAGE64 };
        }));
        
        settledPromises.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                tempNewproductData.push(result.value);
            } else {
                console.error(`Error fetching IMAGE64 for newproductData ${index}:`, result.reason);
            }
        });
        
        setNewproductData(tempNewproductData);
        
    }
    const setNotificationImage = async () => {
        let tempNotificationData: any[] = [];
        const settledPromises = await Promise.allSettled(notificationData.map(async (notificationItem) => {
            const IMAGE64 = await getImagefile('ShowPage', notificationItem);
            return { ...notificationItem, IMAGE64 };
        }));
        
        settledPromises.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                tempNotificationData.push(result.value);
            } else {
                console.error(`Error fetching IMAGE64 for notificationData ${index}:`, result.reason);
            }
        });
        
        setNotificationData(tempNotificationData);
    }
    const setProductImage = async () => {
        let tempProduct: any = [];
        const settledPromises = await Promise.allSettled(product.map(async (productItem) => {
            const IMAGE64 = await getImagefile('ShowContent', productItem);
            return { ...productItem, IMAGE64 };
        }));


        settledPromises.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                tempProduct.push(result.value);
            } else {

                console.error(`Error fetching IMAGE64 for product ${index}:`, result.reason);
            }
        });
        await dispatch(updateAllproductList(tempProduct));
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
    }

    const decrementClock = async () => {
        if (timeLeft === 0 && !refreshing) {
            await setTimeLeft(60);
            if (CState)
                await FetchDataProject()
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
        console.log(notificationData.length.toString())
        await AsyncStorage.setItem('noti', notificationData.length.toString())
        await setNotivalue(notificationData.length.toString())
        await navigation.navigate('ShowTemppage' as never, { name: Language.t('notiAlert.header'), route: notificationData } as never)
    }
    const getProducrCategory = async (item: any) => {
        navigation.navigate('ProductCategory' as never, { name: Language.t('product.category'), route: item } as never)
    }

    const onRefresh = async () => {
        await setRefreshing(true);
        await setTimeLeft(60);
        if (CState)
            await FetchDataProject()

        await setRefreshing(false);
        await getNotiData()
        console.log(`reloade completed`)

    };

    const FetchDataProject = async () => {
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
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'GetProject',
                'BPAPUS-PARAM':
                    '{"SHWJ_GUID": "' +
                    projList.projList.SHWJH_GUID +
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
                        // fetchLayoutData('Banner',  temp_data.BANNER, fullDay),
                        fetchLayoutData('Notication', temp_data.NOTI, fullDay),
                        fetchLayoutData('Category', temp_data.CATEGORY, fullDay),
                        fetchLayoutData('Promotion', temp_data.PROMOTION, fullDay),
                        fetchLayoutData('Newproduct', temp_data.NEWPRODUCT, fullDay),
                        fetchLayoutData('Activity', temp_data.ACTIVITY, fullDay),
                        fetchLayoutData('Mycard', temp_data.MYCARD, fullDay),
                        fetchLayoutData('Docinfo', temp_data.DOCINFO, fullDay),
                    ])

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

    const fetchLayoutData = async (LayoutKey: String, LayoutList: any, fullDay: any) => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
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
                        dispatch(updateBannerList(responseData.SHOWLAYOUT))
                        await fetchPageiItem(LayoutKey, responseData.SHOWPAGE.sort((a: any, b: any) => {
                            return b.SHWLD_SEQ - a.SHWLD_SEQ;
                        }), fullDay)
                    }

                    if (LayoutKey == 'Category') {

                        await dispatch(updateCategoryList(responseData.SHOWLAYOUT))
                        ProducrALL = await getProducrALLCategory(responseData.SHOWPAGE)
                        let tempCPTNC = await getPageProJ(responseData.SHOWPAGE)
                        await setCategoryData(tempCPTNC)
                        await dispatch(updateCategoryPage(tempCPTNC))

                    }
                    if (LayoutKey == 'Activity') {
                        await dispatch(updateActivityList(responseData.SHOWLAYOUT))
                        await setActivityData(responseData.SHOWPAGE)
                        await dispatch(updateActivityPage(responseData.SHOWPAGE))
                    }

                    if (LayoutKey == 'Newproduct') {
                        await dispatch(updateNewproductList(responseData.SHOWLAYOUT))
                        await dispatch(updateNewproductPage(responseData.SHOWPAGE))
                        await fetchNewproductContent('Newproduct', responseData.SHOWPAGE[0])
                    }

                    if (LayoutKey == 'Docinfo') {
                        await dispatch(updateDocinfoList(responseData.SHOWLAYOUT))
                        await dispatch(updateDocinfoPage(await fetchDocType(responseData.SHOWPAGE)))
                    }
                    if (LayoutKey == 'Promotion') {
                        await dispatch(updatePromotionList(responseData.SHOWLAYOUT))

                        await fetchPageiItem(LayoutKey, responseData.SHOWPAGE.sort((a: any, b: any) => {
                            return b.SHWLD_SEQ - a.SHWLD_SEQ;
                        }), fullDay)

                    }

                    if (LayoutKey == 'Notication') {
                        await dispatch(updateNotificationList(responseData.SHOWLAYOUT))
                        await fetchPageiItem(LayoutKey, responseData.SHOWPAGE.sort((a: any, b: any) => {
                            return b.SHWLD_SEQ - a.SHWLD_SEQ;
                        }), fullDay)
                    }
                    if (LayoutKey == 'Mycard') {
                        await dispatch(updateMycardList(responseData.SHOWLAYOUT))
                        await dispatch(updateMycardPage(responseData.SHOWPAGE))
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
    const fetchDocType = async (SHOWLAYOUT: any) => {
        console.log(`fetchDocType SHOWLAYOUT >.${JSON.stringify(SHOWLAYOUT)}`)
        let LAYOUTDATA = SHOWLAYOUT
        let DT_DOCCODE = SHOWLAYOUT[0].SHWPH_TTL_ECPTN

        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null

        await fetch(configToken.WebService + '/LookupErp', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'Dc000110',
                'BPAPUS-PARAM': '',
                'BPAPUS-FILTER': `AND(DT_DOCCODE = '${DT_DOCCODE}')`,
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
                        await setNewproductData(responseData.SHOWCONTENT)
                        ProducrALL = [...ProducrALL, ...responseData.SHOWCONTENT]
                        await dispatch(updateAllproductList(ProducrALL.reduce((uniqueArray, item) => {
                            const isUnique = !uniqueArray.some((existingItem: any) => existingItem.SHWC_ALIAS === item.SHWC_ALIAS);
                            if (isUnique) {
                                uniqueArray.push(item);
                            }
                            return uniqueArray;
                        }, [])))
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

                        if (responseData.SHOWPAGE.SHWPH_FROM_DATE <= fullDay && fullDay <= responseData.SHOWPAGE.SHWPH_TO_DATE)
                            await SHOWPAGE.push(responseData.SHOWPAGE)

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
        if (PageKey == 'Promotion' && SHOWPAGE != null) {
            await setPromotionData(SHOWPAGE)
            await dispatch(updatePromotionPage(SHOWPAGE))
        } else if (PageKey == 'Banner' && SHOWPAGE != null) {
            await setBannerData(SHOWPAGE)
            await dispatch(updateBannerPage(SHOWPAGE))
        } else if (PageKey == 'Notication' && SHOWPAGE != null) {
            await setNotificationData(SHOWPAGE)
            await dispatch(updateNotificationPage(SHOWPAGE))
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
                    'BPAPUS-ORDERBY': 'ORDER BY SHWPH_KEY DESC',
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
                    <View >
                        <FlatSlider route={bannerData} />
                    </View>
                    <>
                        <FlatListCategory route={categoryData} onPressCategory={(item: any) => getProducrCategory(item)} />
                        <FlatListPromotion route={promotionData} />
                        <FlatListNewproduct backPage={'Home'} route={newproductData} />
                        <FlatListActivity route={activityData} />
                    </>

                </Animated.ScrollView>
                {/* {refreshing && (<View
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

                </View>)} */}
            </View>
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: statusBarHeight * 2.2 + FontSize.large,
                    backgroundColor: Colors.buttonTextColor,
                    opacity: scrolling,
                    transform: [
                        { translateY: translation },
                    ],

                }}
            />
            <View style={{
                width: deviceWidth,

                paddingTop: statusBarHeight,
                paddingBottom: deviceWidth * 0.1,
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
                    onPress={() => navigation.navigate('ProductSearch' as never, { route: 'ProductSearch' } as never)}
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
                        {(notificationData.length - Number(notivalue)) > 0 && (
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
                                    {notificationData.length - Number(notivalue)}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}




export default HomeScreen;
