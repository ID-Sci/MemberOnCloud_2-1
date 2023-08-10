import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TextInput,
    Modal,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    RefreshControl,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Feather from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

import { FontSize } from '../styles/FontSizeHelper';
import { config, updateUserOe, clearUserList, updateLoginList, clearLoginList } from '../store/slices/configReducer';
import Colors from '../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/store';
import * as safe_Format from '../styles/safe_Format';
import { newproductSelector } from '../store/slices/newproductReducer';
import * as Keychain from 'react-native-keychain';
import { styles } from '../styles/styles';
import CurrencyInput from 'react-native-currency-input';
import { Language, changeLanguage } from '../translations/I18n';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import FlatSlider from '../components/FlatListSlider';

const PurchaseHistoryScreen = () => {
    const newproductList = useAppSelector(newproductSelector)
    const ConfigList = useAppSelector(config)
    const navigation = useNavigation()
    const dispatch = useAppDispatch();
    const [Oe, setOe] = useState([]);
    const [Purchase, setPurchase] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [PurchaseLoading, setPurchaseLoading] = useState(true);
    const [product, setProduct] = useState(newproductList.allproductList)
    const [HistoryTab, setHistoryTab] = useState(true);
    const fetchData = async () => {
        await setLoading(true)
        console.log(`FETCH /LookupErp /Ar000130 => ${ConfigList.UserList.MB_CODE}`);
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null

        await fetch(configToken.WebService + '/LookupErp', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'Ar000130',
                'BPAPUS-PARAM': '',
                "BPAPUS-FILTER": '',
                'BPAPUS-ORDERBY': '',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '0',
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                if (json.ResponseCode == '200') {
                    let responseRedeem = JSON.parse(json.ResponseData).Ar000130.filter((filterItem: any) => { return filterItem.AR_MBCODE == ConfigList.UserList.MB_CODE })
                    // 
                    console.log(responseRedeem.length)
                    if (responseRedeem.length > 0)
                        await fetchOE(responseRedeem[0].AR_CODE)
                    else
                        Alert.alert(Language.t('notiAlert.header'), `ไม่พบข้อมูล`, [
                            { text: Language.t('alert.confirm'), onPress: () => console.log() }])
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

    }
    const fetchOE = async (AR_CODE: String) => {

        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        let Oe002304: any[] = [{
            Oe002304: {},
            Oe002304Info: {}
        }]
        let Oe000304: string | any[] = []

        console.log(`FETCH /LookupErp /Oe002304 => ${AR_CODE}`);
        await fetch(configToken.WebService + '/LookupErp', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'Oe002304',
                'BPAPUS-PARAM': '',
                "BPAPUS-FILTER": '',
                'BPAPUS-ORDERBY': '',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '0',
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                if (json.ResponseCode == '200') {
                    let responseRedeem = JSON.parse(json.ResponseData).Oe002304.filter((filterItem: any) => { return filterItem.AR_CODE == AR_CODE })
                    console.log(responseRedeem.length)
                    if (responseRedeem.length > 0)
                        Oe002304 = responseRedeem
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
        console.log(`Oe002304 >> ${Oe002304.length}`)
        console.log(`FETCH /LookupErp /Oe000304 => ${AR_CODE}`);

        await fetch(configToken.WebService + '/LookupErp', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'Oe000304',
                'BPAPUS-PARAM': '',
                "BPAPUS-FILTER": '',
                'BPAPUS-ORDERBY': '',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '0',
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.ResponseCode == '200') {
                    let responseRedeem = JSON.parse(json.ResponseData).Oe000304.filter((filterItem: any) => { return filterItem.AR_CODE == AR_CODE })
                    console.log(responseRedeem.length)
                    if (responseRedeem.length > 0)
                        Oe000304 = responseRedeem
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
        console.log(`Oe000304 >> ${Oe000304.length}`)
        let tempObj: any[] = []


        const combinedArray: any[] = Oe002304.concat(Oe000304);
        // const combinedArray: any[] = Oe002304;
        console.log(`combinedArray >>  ${combinedArray.length}`)
        await combinedArray.sort((a, b) => {
            return b.DI_KEY - a.DI_KEY;
        })

        for (var i in combinedArray) {
            console.log(`load ${i}/{${combinedArray.length}}`)
            tempObj.push(await GetInvoiceDocinfo(combinedArray[i]))
            if (tempObj.length >= Oe.length)
                setOe(tempObj)
        }

        await setLoading(false)

        await dispatch(updateUserOe(tempObj))


    }
    const GetInvoiceDocinfo = async (OeKEY: any) => {

        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        let responseData: never[] = []
        await fetch(configToken.WebService + '/UpdateErp', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'GetInvoiceDocinfo',
                'BPAPUS-PARAM': '{\"DI_KEY\":\"' + OeKEY.DI_KEY + '\"}',
                'BPAPUS-FILTER': "",
                'BPAPUS-ORDERBY': '',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '0',
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                responseData = JSON.parse(json.ResponseData);
                responseData.DOCINFO.DI_REF = OeKEY.DI_REF
            })
            .catch((error) => {
                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => console.log() }])
                console.log('ERROR ' + error);
            });
        return responseData
    }
    const onRefresh = async () => {
        await setOe([])
        await fetchData()
        console.log(`reloade completed`)

    };

    useEffect(() => {
        onRefresh()
        console.log(`Loading >> ${Loading}`)
        // Oe && Oe.map((item, index) => {
        // console.log()
        // })
    }, []);

    return (
        <View
            style={{
                backgroundColor: '#fff',
                width: deviceWidth,
                height: deviceHeight
            }}
        >
            <View style={styles.header}>
                <Text
                    style={styles.header_text_title}>
                    {Language.t('profileCard.viewOrderHistory')}
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.header_text_Xtitle}
                    >
                        x
                    </Text>
                </TouchableOpacity>
            </View>
            < >
                <View style={{ padding: 10 }} >
                    <View
                        style={{
                            height: 35,
                            width: deviceWidth - 20,
                            borderBottomColor: '#000000',
                            borderBottomWidth: 0.2,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            alignItems: 'stretch',
                            justifyContent: 'space-between',
                        }}>
                        <TouchableOpacity
                            onPress={() => setHistoryTab(true)}
                        >
                            <Text
                                style={{
                                    fontFamily: 'Kanit-Bold',
                                    color: HistoryTab == true ? '#0288D1' : 'black',
                                    paddingLeft: 20,
                                    fontSize: FontSize.medium,
                                }}>
                                {Language.t('history.active')}
                            </Text>
                        </TouchableOpacity>
                        <Text style={{}}>
                            /
                        </Text>
                        <TouchableOpacity
                            onPress={() => setHistoryTab(false)}>
                            <Text
                                style={{
                                    fontFamily: 'Kanit-Bold',
                                    color: HistoryTab == true ? 'black' : 'red',
                                    paddingRight: 20,
                                    fontSize: FontSize.medium,
                                }}>
                                {Language.t('history.canceled')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {HistoryTab ? (
                    <ScrollView
                        style={{
                            width: deviceWidth,
                        }}

                        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
                        bounces={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.obj_list}>
                            {Oe.filter((filterItem: any) => { return filterItem.DOCINFO.DI_ACTIVE == '0' }).map((item: { DOCINFO: { DI_REF: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; DI_DATE: any; }; TRANSTKD: { map: (arg0: { (obj: any): number; (obj: any): number; (obj: any): number; (obj: any): number; }) => any[]; TRD_K_U_PRC: string; }; }, index: any) => {
                                return (
                                    <>
                                        <View style={{
                                            padding: 10,
                                            width: deviceWidth - 40,
                                            alignItems: 'center',
                                            borderColor: Colors.borderColor,
                                            borderBottomWidth: 1
                                        }}>
                                            <TouchableOpacity style={{
                                                width: deviceWidth - 40,
                                                backgroundColor: '#fff', alignItems: 'center',
                                                justifyContent: 'center',
                                            }} onPress={() => navigation.navigate('PurchaseHistoryInfo', { route: item })}>
                                                <View style={{
                                                    width: deviceWidth - 40,
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    flexDirection: 'row',
                                                }}>
                                                    <Text style={styles.DI_REFLight} >{item.DOCINFO.DI_REF}</Text>
                                                    <Text style={styles.textLight}>{safe_Format.dateFormat(item.DOCINFO.DI_DATE)}</Text>
                                                </View>
                                                <View style={{
                                                    width: deviceWidth - 40,
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    flexDirection: 'row',
                                                }}>
                                                    <Text style={styles.textLight} >
                                                        X {item.TRANSTKD.map((obj: any) => Number(obj.TRD_QTY))
                                                            .reduce((accumulator: any, currentValue: any) => accumulator + currentValue, 0)} ชิ้น

                                                    </Text>
                                                    <View
                                                        style={{
                                                            width: deviceWidth * 0.4,
                                                            justifyContent: 'flex-end',
                                                            alignItems: 'center',
                                                            flexDirection: 'row',
                                                        }}
                                                    >
                                                        <Text style={styles.textLight} >
                                                            {Language.t('history.orderList')}: ฿
                                                        </Text>
                                                        <Text style={styles.textLight}>
                                                            {safe_Format.formatCurrency(item.TRANSTKD.TRD_K_U_PRC == '' ? 0 : item.TRANSTKD.map((obj: { TRD_K_U_PRC: number; TRD_QTY: number; }) => Number(obj.TRD_K_U_PRC * obj.TRD_QTY))
                                                                .reduce((accumulator: any, currentValue: any) => accumulator + currentValue, 0))}
                                                        </Text>
                                                    </View>
                                                </View>

                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )
                            })}


                        </View>
                        {Loading && (
                            <View
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: deviceWidth,
                                    borderRadius: deviceWidth * 0.05,
                                    padding: 50,
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
                                    <ActivityIndicator animating={Loading} size={FontSize.large} color="#0288D1" />
                                </View>

                            </View>
                        )}

                    </ScrollView>
                ) : (
                    <ScrollView
                        style={{
                            width: deviceWidth,
                        }}

                        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
                        bounces={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.obj_list}>
                            {Oe.filter((filterItem: any) => { return filterItem.DOCINFO.DI_ACTIVE == '1' }).map((item: { DOCINFO: { DI_REF: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; DI_DATE: any; }; TRANSTKD: { map: (arg0: { (obj: any): number; (obj: any): number; (obj: any): number; (obj: any): number; }) => any[]; TRD_K_U_PRC: string; }; }, index: any) => {
                                return (
                                    <>
                                        <View style={{
                                            padding: 10,
                                            width: deviceWidth - 40,
                                            alignItems: 'center',
                                            borderColor: Colors.borderColor,
                                            borderBottomWidth: 1
                                        }}>
                                            <TouchableOpacity style={{
                                                width: deviceWidth - 40,
                                                backgroundColor: '#fff', alignItems: 'center',
                                                justifyContent: 'center',
                                            }} onPress={() => navigation.navigate('PurchaseHistoryInfo', { route: item })}>
                                                <View style={{
                                                    width: deviceWidth - 40,
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    flexDirection: 'row',
                                                }}>
                                                    <Text style={styles.DI_REFCanceled} >{item.DOCINFO.DI_REF}</Text>


                                                    <Text style={styles.textLight}>{safe_Format.dateFormat(item.DOCINFO.DI_DATE)}</Text>
                                                </View>
                                                <View style={{
                                                    width: deviceWidth - 40,
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    flexDirection: 'row',
                                                }}>
                                                    <Text style={styles.textLight} >
                                                        X {item.TRANSTKD.map((obj: any) => Number(obj.TRD_QTY))
                                                            .reduce((accumulator: any, currentValue: any) => accumulator + currentValue, 0)} ชิ้น

                                                    </Text>
                                                    <View
                                                        style={{
                                                            width: deviceWidth * 0.4,
                                                            justifyContent: 'flex-end',
                                                            alignItems: 'center',
                                                            flexDirection: 'row',
                                                        }}
                                                    >
                                                        <Text style={styles.textLight} >
                                                            {Language.t('history.orderList')}: ฿
                                                        </Text>
                                                        <Text style={styles.textLight}>
                                                            {safe_Format.formatCurrency(item.TRANSTKD.TRD_K_U_PRC == '' ? 0 : item.TRANSTKD.map((obj: { TRD_K_U_PRC: number; TRD_QTY: number; }) => Number(obj.TRD_K_U_PRC * obj.TRD_QTY))
                                                                .reduce((accumulator: any, currentValue: any) => accumulator + currentValue, 0))}
                                                        </Text>
                                                    </View>
                                                </View>

                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )
                            })}


                        </View>
                        {Loading && (
                            <View
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: deviceWidth,
                                    borderRadius: deviceWidth * 0.05,
                                    padding: 50,
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
                                    <ActivityIndicator animating={Loading} size={FontSize.large} color="#0288D1" />
                                </View>

                            </View>
                        )}

                    </ScrollView>
                )}



            </ >

        </View>
    )

}

export default PurchaseHistoryScreen 