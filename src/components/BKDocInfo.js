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
import { styles, statusBarHeight, deviceWidth, deviceHeight } from '../styles/styles';
import CurrencyInput from 'react-native-currency-input';
import { Language, changeLanguage } from '../translations/I18n';

import FlatSlider from '../components/FlatListSlider';

const BKDocInfo = ({ AR_CODE }) => {
    console.log(`AR_CODE :> ${AR_CODE}`)
    const newproductList = useAppSelector(newproductSelector)
    const ConfigList = useAppSelector(config)
    const navigation = useNavigation()
    const [Oe, setOe] = useState([]);
    const [Loading, setLoading] = useState(true);


    const fetchData = async (AR_CODE) => {
        let tempObj = []
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null

        console.log(`FETCH /LookupErp /Oe002304 => ${AR_CODE}`);
        await fetch(configToken.WebService + '/LookupErp', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'Oe002304',
                'BPAPUS-PARAM': '',
                "BPAPUS-FILTER": `AND (AR_CODE ='${AR_CODE}')`,
                'BPAPUS-ORDERBY': `ORDER BY DI_DATE DESC,DI_REF DESC`,
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '0',
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                if (json.ResponseCode == '200') {
                    let responseRedeem = JSON.parse(json.ResponseData).Oe002304
                    console.log(responseRedeem.length)
                    if (responseRedeem.length > 0) {
                        await Promise.allSettled(responseRedeem.map(async (item, index) => {
                            console.log(`load ${index + 1}/${responseRedeem.length}`);
                            tempObj.push(await GetInvoiceDocinfo(item));
                        }))
                       await setOe(tempObj.sort((a, b) => {
                            // Compare DI_DATE in descending order
                            const dateComparison = b.DOCINFO.DI_DATE.localeCompare(a.DOCINFO.DI_DATE);
                            
                            // If DI_DATE is equal, compare DI_REF in descending order
                            if (dateComparison === 0) {
                              return b.DOCINFO.DI_REF.localeCompare(a.DOCINFO.DI_REF);
                            }
                            
                            return dateComparison;
                          }));
                    }

                    // await Promise.allSettled([
                    //     setBannerImage(),
                    //     setCategoryImage(),
                    //     setPromotionImage(),
                    //     setActivityImage(),
                    //     setNewproductImage(),
                    //     setNotificationImage(),
                    //     setProductImage()
                    // ])
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
    const processResponseRedeem = async (responseRedeem) => {




    }
    const GetInvoiceDocinfo = async (OeKEY) => {

        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        let responseData = []
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
                responseData.DOCINFO = OeKEY
            })
            .catch((error) => {
                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => console.log() }])
                console.log('ERROR ' + error);
            });
        return responseData
    }
    const onRefresh = async () => {
        await setLoading(true)
        await setOe([])
        await fetchData(AR_CODE)
        console.log(`reloade completed`)

    };

    useEffect(() => {
        if (Oe.length == 0)
            onRefresh()
    }, [AR_CODE]);

    return (
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
                {Oe.map((item) => {
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
                                        <Text style={item.DOCINFO.DI_ACTIVE == '0' ? styles.DI_REFLight : styles.DI_REFCanceled} >{item.DOCINFO.DI_REF}</Text>
                                        <Text style={item.DOCINFO.DI_ACTIVE == '0' ? styles.Docinfo_Light : styles.Docinfo_Canceled}>{safe_Format.dateFormat(item.DOCINFO.DI_DATE)}</Text>
                                    </View>
                                    <View style={{
                                        width: deviceWidth - 40,
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row',
                                    }}>
                                        <Text style={item.DOCINFO.DI_ACTIVE == '0' ? styles.Docinfo_Light : styles.Docinfo_Canceled} >
                                            X {item.TRANSTKD.map((obj) => Number(obj.TRD_QTY))
                                                .reduce((accumulator, currentValue) => accumulator + currentValue, 0)} ชิ้น

                                        </Text>
                                        <View
                                            style={{
                                                width: deviceWidth * 0.4,
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <Text style={item.DOCINFO.DI_ACTIVE == '0' ? styles.Docinfo_Light : styles.Docinfo_Canceled} >
                                                {Language.t('history.orderList')}: ฿
                                            </Text>
                                            <Text style={item.DOCINFO.DI_ACTIVE == '0' ? styles.Docinfo_Light : styles.Docinfo_Canceled}>
                                                {safe_Format.formatCurrency(item.TRANSTKD.TRD_K_U_PRC == '' ? 0 : item.TRANSTKD.map((obj) => Number(obj.TRD_K_U_PRC * obj.TRD_QTY))
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
    )

}

export default BKDocInfo 