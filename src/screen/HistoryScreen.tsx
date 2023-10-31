import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Feather from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

import { FontSize } from '../styles/FontSizeHelper';
import { config, updateUserList, clearUserList, updateLoginList, clearLoginList } from '../store/slices/configReducer';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/store';
import * as safe_Format from '../styles/safe_Format';
import { Language, changeLanguage } from '../translations/I18n';
import * as Keychain from 'react-native-keychain';
import { styles,statusBarHeight, deviceWidth,deviceHeight} from '../styles/styles';
const HistoryScreen = () => {
    const ConfigList = useAppSelector(config)
    const navigation = useNavigation()

    const [HistoryTab, setHistoryTab] = useState(true);
    const [Redeem, setRedeem] = useState([]);
    const [Purchase, setPurchase] = useState([]);
    const [RedeemLoading, setRedeemLoading] = useState(true);
    const [PurchaseLoading, setPurchaseLoading] = useState(true);
    console.log(`ConfigList.UserList ${ConfigList.UserList}`)

    const CDateForPopup = async () => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null

        console.log(configToken.WebService)
        await fetch(configToken.WebService + '/ServerReady', {
            method: 'GET'
        })
            .then((response: any) => {
                return response.headers.map.date
            })
            .then(async (json) => {
                let datetime = new Date(json)
                var day: any = datetime.getDate()
                day = day > 9 ? day : '0' + day
                var month: any = datetime.getMonth() + 1
                month = month > 9 ? month : '0' + month

                var year = datetime.getFullYear()
                let fullODate = year - 100 + '' + month + '01'
                var year = datetime.getFullYear()
                let fullDate = year + '' + month + '' + day
                console.log()
                console.log('>')
                console.log(fullODate)
                console.log(fullDate)
                console.log()
                await fetchUserData(fullODate, fullDate)



            }).catch(async (error) => {
                let datetime = new Date()
                var day: any = datetime.getDate()
                day = day > 9 ? day : '0' + day
                var month: any = datetime.getMonth() + 1
                month = month > 9 ? month : '0' + month

                var year = datetime.getFullYear()
                let fullODate = year - 100 + '' + month + '01'
                var year = datetime.getFullYear()
                let fullDate = year + '' + month + '' + day
                console.log()
                console.log('>')
                console.log(fullODate)
                console.log(fullDate)
                console.log()
                await fetchUserData(fullODate, fullDate)
                console.log('ERROR ' + error);
            });

    }
    const fetchUserData = async (ODate: any, ToDate: any) => {
        console.log('FETCH /LookupErp');
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null


        await fetch(configToken.WebService + '/Member', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'ShowMemberRedeem',
                'BPAPUS-PARAM':
                    '{"MB_LOGIN_GUID": "' +
                    ConfigList.MB_LOGIN_GUID +
                    '","MBP_FM_DATE": "' +
                    ODate +
                    '", "MBP_TO_DATE": "' +
                    ToDate +
                    '"}',
                'BPAPUS-FILTER': '',
                'BPAPUS-ORDERBY': '',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '0',
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.ResponseCode == '200') {
                    let responseRedeem = JSON.parse(json.ResponseData);
                    console.log(responseRedeem)
                    setRedeem(responseRedeem.ShowMemberRedeem)
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

        await setRedeemLoading(false)

        await fetch(configToken.WebService + '/Member', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'ShowMemberPurchase',
                'BPAPUS-PARAM':
                    '{"MB_LOGIN_GUID": "' +
                    ConfigList.MB_LOGIN_GUID +
                    '","MBP_FM_DATE": "' +
                    ODate +
                    '", "MBP_TO_DATE": "' +
                    ToDate +
                    '"}',
                'BPAPUS-FILTER': '',
                'BPAPUS-ORDERBY': '',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '0',
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.ResponseCode == '200') {
                    let responsePurchase = JSON.parse(json.ResponseData);
                    console.log(responsePurchase)
                    setPurchase(responsePurchase.ShowMemberPurchase)
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
        await setPurchaseLoading(false)
    }


    useEffect(() => {
        CDateForPopup()

    }, []);

    return (
        <View
            style={{
                width: deviceWidth,
                height: deviceHeight+statusBarHeight
            }}
        >
            <View

                style={styles.header}>
                <Text
                    style={styles.header_text_title}>
                    {Language.t('profileCard.detail')}
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
            <View
                style={{
                    backgroundColor: 'white',
                    flex: 1,
                    flexDirection: 'column',
                }}>

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
                                {Language.t('history.purchaseHistoryTabTitle')}
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
                                    color: HistoryTab == true ? 'black' : '#0288D1',
                                    paddingRight: 20,
                                    fontSize: FontSize.medium,
                                }}>
                                {Language.t('history.redeemHistoryTabTitle')}
                            </Text>
                        </TouchableOpacity>

                    </View>
                    {
                        HistoryTab ? <ScrollView>
                            {PurchaseLoading ? <ActivityIndicator

                                animating={PurchaseLoading}
                                style={{ marginTop: deviceHeight * 0.25 }}
                                size="large"
                                color="#0288D1"
                            /> : Purchase.length > 0 ?
                                Purchase.map((items) => {
                                    return (
                                        <View
                                            style={{
                                                padding: 10,
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.2,
                                                marginBottom: 1
                                            }}
                                        >
                                            <Text style={styles.textLight}>
                                                {Language.t('history.Ref')} # {items.MBP_REF}
                                            </Text>
                                            <View >
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                    }} >
                                                    <View style={{ width: (deviceWidth * 0.6) - 20 }}>
                                                        <Text style={styles.textLight}>
                                                            {Language.t('history.purchaseDate')}
                                                        </Text>
                                                    </View>
                                                    <View

                                                        style={{
                                                            width: (deviceWidth * 0.4) - 20,
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between'
                                                        }}>
                                                        <Text style={styles.textLight}>
                                                            {Language.t('history.pointBalance')}
                                                        </Text>
                                                        <Text style={styles.textLight}>
                                                            {safe_Format.pointFormat(items.MBP_POINT)}
                                                        </Text>
                                                    </View>

                                                </View>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                    }} >
                                                    <View style={{ width: (deviceWidth * 0.6) - 20 }}>
                                                        <Text style={styles.textLight}>
                                                            {safe_Format.dateFormat(items.MBP_DATE)} {Language.t('history.time')} {safe_Format.timeFormat(items.MBP_TIME)}
                                                        </Text>
                                                    </View>
                                                    <View

                                                        style={{
                                                            width: (deviceWidth * 0.4) - 20,
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between'
                                                        }}>
                                                        <Text style={styles.textLight}>
                                                            {Language.t('history.billAmount')}
                                                        </Text>
                                                        <Text style={styles.textLight}>
                                                            {safe_Format.currencyFormat(items.MBP_RDM)}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                }) : <View
                                    style={{
                                        padding: 10,
                                        borderBottomColor: '#000000',
                                        borderBottomWidth: 0.2,
                                        marginBottom: 1,
                                        width: deviceWidth,
                                        marginTop: deviceHeight * 0.4,
                                        alignItems: 'center',
                                    }}
                                >

                                    <Text style={styles.textLight}>
                                        {Language.t('history.nodata')}
                                    </Text>

                                </View>
                            }

                        </ScrollView> : <ScrollView>

                            {RedeemLoading ? <ActivityIndicator

                                animating={RedeemLoading}
                                style={{ marginTop: deviceHeight * 0.25 }}
                                size="large"
                                color="#0288D1"
                            /> :
                                Redeem.length > 0 ?
                                    Redeem.map((items) => {
                                        return (
                                            <View
                                                style={{
                                                    padding: 10,
                                                    borderBottomColor: '#000000',
                                                    borderBottomWidth: 1,

                                                }}
                                            >
                                                <Text style={styles.textLight}>
                                                    {Language.t('history.Ref')} # {items.MBP_REF}
                                                </Text>
                                                <View >
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                        }} >
                                                        <View style={{ width: (deviceWidth * 0.4) - 20 }}>
                                                            <Text style={styles.textLight}>
                                                                {Language.t('history.pointsExchange')}
                                                            </Text>
                                                        </View>
                                                        <View

                                                            style={{
                                                                width: (deviceWidth * 0.6) - 20,
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-between'
                                                            }}>
                                                            <Text style={styles.textLight}></Text>
                                                            <Text style={styles.textLight}>
                                                                {safe_Format.pointFormat(items.MBP_POINT)} {Language.t('history.points')}
                                                            </Text>
                                                        </View>

                                                    </View>
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                        }} >
                                                        <View style={{ width: (deviceWidth * 0.4) - 20 }}>
                                                            <Text style={styles.textLight}>
                                                                {Language.t('history.activeWhen')}
                                                            </Text>
                                                        </View>
                                                        <View

                                                            style={{
                                                                width: (deviceWidth * 0.6) - 20,
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-between'
                                                            }}>
                                                            <Text style={styles.textLight}></Text>
                                                            <Text style={styles.textLight}>
                                                                {safe_Format.dateFormat(items.MBP_DATE)} {Language.t('history.time')} {safe_Format.timeFormat(items.MBP_TIME)}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                                    : <View
                                        style={{
                                            padding: 10,
                                            borderBottomColor: '#000000',
                                            borderBottomWidth: 0.2,
                                            marginBottom: 1,
                                            width: deviceWidth,
                                            marginTop: deviceHeight * 0.4,
                                            alignItems: 'center',
                                        }}
                                    >

                                        <Text style={{
                                            color: 'black',
                                            fontSize: FontSize.medium,
                                        }}>
                                            {Language.t('history.nodata')}
                                        </Text>

                                    </View>
                            }
                        </ScrollView>
                    }

                </View>

            </View>


        </View>
    )

}

export default HistoryScreen 