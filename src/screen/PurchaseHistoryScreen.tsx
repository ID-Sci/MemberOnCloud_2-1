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
    const [Oe, setOe] = useState(ConfigList.Oe);
    const [Purchase, setPurchase] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [PurchaseLoading, setPurchaseLoading] = useState(true);
    const [product, setProduct] = useState(newproductList.allproductList)

    const fetchData = async () => {
        setLoading(true)
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
            .then((json) => {
                if (json.ResponseCode == '200') {
                    let responseRedeem = JSON.parse(json.ResponseData).Ar000130.filter((filterItem: any) => { return filterItem.AR_MBCODE == ConfigList.UserList.MB_CODE })
                    // 
                    console.log(responseRedeem.length)
                    if (responseRedeem.length > 0)
                        fetchOE(responseRedeem[0].AR_CODE)
                    else
                        Alert.alert(Language.t('notiAlert.header'), `ไม่พบข้อมูล`, [
                            { text: Language.t('alert.confirm'), onPress: () => console.log() }])
                } else {
                    Alert.alert(Language.t('notiAlert.header'), `${json.ReasonString}`, [
                        { text: Language.t('alert.confirm'), onPress: () => console.log() }])
                }

            })
            .catch((error) => {
                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => console.log() }])
                console.log('ERROR ' + error);
            });

    }
    const fetchOE = async (AR_CODE: String) => {
        console.log(`FETCH /LookupErp /Oe002304 => ${AR_CODE}`);
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        let Oe002304: any[] = [{
            Oe002304: {},
            Oe002304Info: {}
        }]
        let Oe000304: string | any[] = []
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
                    Alert.alert(Language.t('notiAlert.header'), `${json.ReasonString}`, [
                        { text: Language.t('alert.confirm'), onPress: () => console.log() }])
                }

            })
            .catch((error) => {
                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => console.log() }])
                console.log('ERROR ' + error);
            });
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
                    Alert.alert(Language.t('notiAlert.header'), `${json.ReasonString}`, [
                        { text: Language.t('alert.confirm'), onPress: () => console.log() }])
                }
            })
            .catch((error) => {
                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => console.log() }])
                console.log('ERROR ' + error);
            });
        let tempObj: any[] = []
        console.log(`Oe002304 >> ${Oe002304.length}`)
        console.log(`Oe000304 >> ${Oe000304.length}`)
        const combinedArray: any[] = Oe002304.concat(Oe000304);
        // const combinedArray: any[] = Oe002304;
        console.log(`combinedArray >> ${combinedArray.length}`)
        await combinedArray.sort((a, b) => {
            return b.DI_DATE - a.DI_DATE;
        })
        for (var i in combinedArray) {
            tempObj.push(await GetInvoiceDocinfo(combinedArray[i]))
        }


        await setOe(tempObj)
        await dispatch(updateUserOe(tempObj))

        await setLoading(false)
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

            })
            .catch((error) => {
                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => console.log() }])
                console.log('ERROR ' + error);
            });
        return responseData
    }
    const onRefresh = async () => {

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
                    {Language.t('history.purchaseHistoryTabTitle')}
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
                <ScrollView
                    style={{
                        width: deviceWidth,
                    }}

                    refreshControl={<RefreshControl Loading={false} onRefresh={onRefresh} />}
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.obj_list}>

                        {Oe.map((item, index) => {
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
                                                <Text style={styles.textLight} >{item.DOCINFO.DI_REF}</Text>
                                                <Text style={styles.textLight}>{safe_Format.dateFormat(item.DOCINFO.DI_DATE)}</Text>
                                            </View>
                                            <View
                                                style={{
                                                    width: deviceWidth * 0.8,
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    flexDirection: 'row',
                                                }}>
                                                <View style={{
                                                    alignItems: 'flex-start',
                                                    justifyContent: 'center',
                                                    width: deviceWidth * 0.2,
                                                    height: deviceWidth * 0.2,
                                                }}>
                                                    {product && !product.find(obj => obj.GOODS_CODE == item.TRANSTKD[0].GOODS_CODE) || product.find(obj => obj.GOODS_CODE == item.TRANSTKD[0].GOODS_CODE).IMAGE64 == "" ? <Image
                                                        style={{
                                                            resizeMode: 'contain',
                                                            height: deviceWidth * 0.15,
                                                            width: deviceWidth * 0.15,
                                                        }}
                                                        source={require('../img/newproduct.png')}
                                                    /> : <Image
                                                        style={{
                                                            resizeMode: 'contain',
                                                            height: deviceWidth * 0.15,
                                                            width: deviceWidth * 0.15,
                                                        }}
                                                        source={{ uri: `data:image/png;base64,${product.find(obj => obj.GOODS_CODE == item.TRANSTKD[0].GOODS_CODE).IMAGE64}` }}
                                                    />}
                                                </View>
                                                <View style={{
                                                    width: deviceWidth * 0.6,
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    flexDirection: 'row',
                                                }}>
                                                    <View>
                                                        <View style={{
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            width: deviceWidth * 0.6,
                                                            flexDirection: 'row',
                                                        }}>
                                                            <Text style={styles.textLight}>
                                                                {Language.getLang() == 'th' ? product.find(obj => obj.GOODS_CODE == item.TRANSTKD[0].GOODS_CODE)?.SHWC_ALIAS :product.find(obj => obj.GOODS_CODE == item.TRANSTKD[0].GOODS_CODE)?.SHWC_EALIAS}
                                                            </Text>
                                                        </View>
                                                        <View style={{
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            width: deviceWidth * 0.6,
                                                            height: FontSize.large * 2,
                                                            flexDirection: 'row',
                                                        }}>
                                                            <Text style={styles.textLight}>
                                                                X  {item.TRANSTKD[0].TRD_QTY}
                                                            </Text>
                                                            <Text style={styles.textLight}>
                                                                {safe_Format.currencyFormat(item.TRANSTKD[0].TRD_K_U_PRC == '' ? 0 : item.TRANSTKD[0].TRD_K_U_PRC * item.TRANSTKD[0].TRD_QTY)}
                                                            </Text>
                                                            

                                                        </View>

                                                    </View>
                                                </View>
                                            </View>
                                            <View
                                                style={{

                                                    width: deviceWidth * 0.8,
                                                    alignItems: 'center',

                                                    flexDirection: 'row',
                                                }}>
                                                <View
                                                    style={{
                                                        width: deviceWidth * 0.4,
                                                        justifyContent: 'flex-start',
                                                        height: deviceHeight * 0.1,
                                                        alignItems: 'center',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <Text style={styles.textLight} >
                                                        X {item.TRANSTKD.map(obj => Number(obj.TRD_QTY))
                                                            .reduce((accumulator, currentValue) => accumulator + currentValue, 0)} ชิ้น
                                                    </Text>
                                                </View>
                                                <View
                                                    style={{
                                                        width: deviceWidth * 0.4,
                                                        height: deviceHeight * 0.1,
                                                        justifyContent: 'flex-end',
                                                        alignItems: 'center',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <Text style={styles.textLight} >
                                                        {Language.t('history.orderList')}: ฿
                                                    </Text>

                                                    <Text style={styles.textLight}>
                                                        {safe_Format.formatCurrency(item.TRANSTKD.TRD_K_U_PRC == '' ? 0 : item.TRANSTKD.map(obj => Number(obj.TRD_K_U_PRC * obj.TRD_QTY))
                                                            .reduce((accumulator, currentValue) => accumulator + currentValue, 0))}
                                                    </Text>
                                                </View>

                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )
                        })}


                    </View>
                </ScrollView>

                {Loading && (<View
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
                        <ActivityIndicator animating={Loading} size={FontSize.large} color="#0288D1" />
                    </View>

                </View>)}
            </ >
        </View>
    )

}

export default PurchaseHistoryScreen 