import React, { useState, useEffect } from 'react';

import {
    ScrollView,
    Dimensions,
    Text,
    Image,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../styles/colors';
import { FontSize } from '../styles/FontSizeHelper';
import CurrencyInput from 'react-native-currency-input';
import { useAppDispatch, useAppSelector } from '../store/store'
import { updateBasket, updatePrepareDocumentt } from '../store/slices/basketReducer';
import { docinfoSelector } from '../store/slices/docinfoReducer';
import * as Keychain from 'react-native-keychain';
import { Language, changeLanguage } from '../translations/I18n';
import { config, updateARcode, updateUserOe } from '../store/slices/configReducer';
import * as safe_Format from '../styles/safe_Format';
import { styles, statusBarHeight, deviceWidth, deviceHeight } from '../styles/styles';


export default FlatListBasket = ({ backPage, items, itemsERP, prepareDocument }) => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const [amount, setAmount] = useState(0)
    const [data, setData] = useState(items)
    const [dataItem, setDataItem] = useState(itemsERP)
    const [loading, setloading] = useState(true)
    const [createAR, setCreateAR] = useState(false)

    const [prepareDoc, setPrepareDoc] = useState(prepareDocument)
    const ConfigList = useAppSelector(config)
    const docinfoType = useAppSelector(docinfoSelector).docinfoPage[0]
    const PromotionType = useAppSelector(docinfoSelector).docinfoPage[1].SHWPH_TTL_CPTN
    console.log(JSON.stringify(useAppSelector(docinfoSelector).docinfoPage))


    console.log(`PromotionType >> ${docinfoType}`)

    useEffect(() => {
        setData(items)
        setDataItem(itemsERP)
        setPrepareDoc(prepareDocument)

    }, [items]);

    useEffect(() => {
        console.log(`JSON.stringify(dataItem) >> ${JSON.stringify(dataItem)}`)
        let sum = 0
        for (var i in dataItem)
            sum += dataItem[i].TRD_QTY * dataItem[i].TRD_K_U_PRC
        items.length > 0 && setAmount(sum)
        setloading(false)

    }, [dataItem]);


    const calBasket = async () => {
        await setloading(true)

        if (docinfoType.SHWPH_TTL_CPTN.includes('BOOKING')) await calBasketSellOrder()

        if (docinfoType.SHWPH_TTL_CPTN.includes('SELL'))
            await calBasketInvoice()


        // await saveBasket()


    }
    const saveBasket = async () => {


        if (docinfoType.SHWPH_TTL_CPTN.includes('BOOKING'))
            await saveBasketSellOrder()

        if (docinfoType.SHWPH_TTL_CPTN.includes('SELL'))
            await saveBasketInvoice()


        await setloading(false)

    }
    const calBasketSellOrder = async () => {
        let newDate = new Date();

        var d = newDate.getDate();
        var m = newDate.getMonth() + 1;
        var y = newDate.getFullYear();
        let DI_DATE = `${y}${(m <= 9 ? '0' + m : m)}${(d <= 9 ? '0' + d : d)}`;

        newDate.setDate(newDate.getDate() + 30);
        var e_d = newDate.getDate();
        var e_m = newDate.getMonth() + 1;
        var e_y = newDate.getFullYear();
        let e_DI_DATE = `${e_y}${(e_m <= 9 ? '0' + e_m : e_m)}${(e_d <= 9 ? '0' + e_d : e_d)}`;

        console.log(`DI_DATE >> ${DI_DATE}`);
        console.log(`e_DI_DATE >> ${e_DI_DATE}`);
        const param = {
            ErpUpdFunc: [
                {

                    ImpTrhHeader: {
                        DI_DATE: DI_DATE,
                        DI_REF: '<เลขถัดไป>',
                        DT_DOCCODE: docinfoType.DT_DOCCODE,
                        DT_PROPERTIES: docinfoType.DT_PROPERTIES,
                        VAT_REF: '<เลขเดียวกัน>',
                        VAT_DATE: DI_DATE,
                        VAT_RATE: '7',
                        VAT_RFR_REF: '<เลขเดียวกัน>',
                        AR_CODE: ConfigList.UserList.AR_CODE,
                        ARD_TDSC_KEYIN: '',
                        TRH_SHIP_DATE: DI_DATE + '0000',
                        TRH_SHIP_ADDB: ConfigList.UserList.ADDB_KEY,
                        TRH_CANCEL_DATE: e_DI_DATE + '0000',
                        PRMT_CODE: PromotionType,
                        AROE_TDSC_KEYIN: '0',
                        AROE_DUE_DA: DI_DATE + '0000',
                        DI_REMARK: 'MEMBER APP',
                    },
                    ImpTrhDetail: dataItem
                },
            ],
        }
        console.log(" ######## calBasketSellOrder  #######", JSON.stringify(param))
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        await fetch(configToken.WebService + '/UpdateErp', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'CalcSellOrderDocinfo',
                'BPAPUS-PARAM': JSON.stringify(param),
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
                    await dispatch(updatePrepareDocumentt(param))
                    console.log(" ==== responseData.ARDETAIL.ARD_B_AMT ===== ", responseData.AROE.AROE_B_AMT)
                    await setAmount(responseData.AROE.AROE_B_AMT)
                    await   saveBasketSellOrder(param)
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

    const saveBasketSellOrder = async (param) => {

        console.log("######## saveBasketSellOrder prepareDocument >>>", JSON.stringify(param))
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        await fetch(configToken.WebService + '/UpdateErp', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'SaveSellOrderDocinfo',
                'BPAPUS-PARAM': JSON.stringify(param),
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
                    console.log(`responseData.DI_KEY >> ${responseData.DI_KEY}`)
                    console.log(JSON.stringify({
                        'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                        'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                        'BPAPUS-FUNCTION': 'SaveSellOrderDocinfo',
                        'BPAPUS-PARAM': JSON.stringify(param),
                        'BPAPUS-FILTER': '',
                        'BPAPUS-ORDERBY': '',
                        'BPAPUS-OFFSET': '0',
                        'BPAPUS-FETCH': '0',
                    }))
                    dispatch(updateBasket([]))
                    Alert.alert(Language.t('notiAlert.header'), Language.t('notiAlert.orderSuccess'), [
                        { text: Language.t('alert.confirm'), onPress: () => navigation.goBack() }])
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
    const calBasketInvoice = async () => {
        let newDate = new Date();

        var d = newDate.getDate();
        var m = newDate.getMonth() + 1;
        var y = newDate.getFullYear();
        let DI_DATE = `${y}${(m <= 9 ? '0' + m : m)}${(d <= 9 ? '0' + d : d)}`;

        newDate.setDate(newDate.getDate() + 30);
        var e_d = newDate.getDate();
        var e_m = newDate.getMonth() + 1;
        var e_y = newDate.getFullYear();
        let e_DI_DATE = `${e_y}${(e_m <= 9 ? '0' + e_m : e_m)}${(e_d <= 9 ? '0' + e_d : e_d)}`;

        console.log(`DI_DATE >> ${DI_DATE}`);
        console.log(`e_DI_DATE >> ${e_DI_DATE}`);

        const param = {
            ErpUpdFunc: [
                {

                    ImpTrhHeader: {
                        DI_DATE: DI_DATE,
                        DI_REF: '<เลขถัดไป>',
                        DT_DOCCODE: docinfoType.DT_DOCCODE,
                        DT_PROPERTIES: docinfoType.DT_PROPERTIES,
                        VAT_REF: '<เลขเดียวกัน>',
                        VAT_DATE: DI_DATE,
                        VAT_RATE: '7',
                        VAT_RFR_REF: '<เลขเดียวกัน>',
                        AR_CODE: ConfigList.UserList.AR_CODE,
                        ARD_TDSC_KEYIN: '',
                        TRH_SHIP_DATE: DI_DATE + '0000',
                        TRH_SHIP_ADDB: ConfigList.UserList.ADDB_KEY,
                        TRH_CANCEL_DATE: e_DI_DATE + '0000',
                        PRMT_CODE: PromotionType,
                        AROE_TDSC_KEYIN: '0',
                        AROE_DUE_DA: DI_DATE + '0000',
                        DI_REMARK: 'MEMBER APP',
                    },
                    ImpTrhDetail: dataItem
                },
            ],
        }
        console.log(" ######## calBasketInvoice  #######", param)
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        await fetch(configToken.WebService + '/UpdateErp', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'CalcInvoiceDocinfo',
                'BPAPUS-PARAM': JSON.stringify(param),
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
                    await dispatch(updatePrepareDocumentt(param))

                    console.log(" ==== responseData.ARDETAIL.ARD_B_AMT ===== ", responseData.ARDETAIL.ARD_B_AMT)
                    await setAmount(responseData.ARDETAIL.ARD_B_AMT)
                    await saveBasketInvoice(param)
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

    const saveBasketInvoice = async (param) => {
        console.log("######## saveBasketInvoice prepareDocument >>>", param)
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        await fetch(configToken.WebService + '/UpdateErp', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'SaveInvoiceDocinfo',
                'BPAPUS-PARAM': JSON.stringify(param),
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
                    dispatch(updateBasket([]))
                    console.log()
                    console.log(JSON.stringify({
                        'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                        'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                        'BPAPUS-FUNCTION': 'SaveInvoiceDocinfo',
                        'BPAPUS-PARAM': JSON.stringify(param),
                        'BPAPUS-FILTER': '',
                        'BPAPUS-ORDERBY': '',
                        'BPAPUS-OFFSET': '0',
                        'BPAPUS-FETCH': '0',
                    }))
                    console.log(JSON.stringify(responseData))
                    console.log()
                    Alert.alert(Language.t('notiAlert.header'), Language.t('notiAlert.orderSuccess'), [
                        { text: Language.t('alert.confirm'), onPress: () => navigation.goBack() }])
                } else {
                    Alert.alert(Language.t('notiAlert.header'), `${json.ReasonString}`, [
                        { text: Language.t('alert.confirm'), onPress: () => console.log() }])
                }
            })
            .catch((error) => {
                Alert.alert(Language.t('notiAlert.header'), `${error}`, [
                    { text: Language.t('alert.confirm'), onPress: () => console.log() }])
                console.log('ERROR ' + error);
            })
    }

    const onPressDelete = async (KEY) => {
        const NewData = await data.filter(function (e) {
            return e.KEY != KEY
        })
        setData(NewData)
        await dispatch(updateBasket(NewData))

        const Newitem = await dataItem.filter(function (e) {
            return e.KEY != KEY
        })
        setDataItem(Newitem)
    }

    const increaseProduct = async (index) => {
        const newData = [...data]
        newData[index] = { ...newData[index], QTY: newData[index].QTY + 1 }
        setData(newData)
        await dispatch(updateBasket(newData))

        const newItem = [...dataItem]
        newItem[index] = { ...newItem[index], TRD_QTY: newItem[index].TRD_QTY + 1 }
        setDataItem(newItem)
    }

    const decreaseProduct = async (index) => {
        const newData = [...data]
        newData[index] = { ...newData[index], QTY: newData[index].QTY - 1 }
        setData(newData)
        await dispatch(updateBasket(newData))

        const newItem = [...dataItem]
        newItem[index] = { ...newItem[index], TRD_QTY: newItem[index].TRD_QTY - 1 }
        setDataItem(newItem)
    }

    const loadingScreen = () => {
        return (
            <View
                style={{
                    width: deviceWidth,
                    height: deviceHeight + statusBarHeight,
                    opacity: 1,
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
        )
    }



    return (data &&
        (
            <View style={{ alignItems: 'flex-end' }}>

                <View style={{
                    width: deviceWidth,
                    height: deviceHeight * 0.9,
                }}>
                    {data.length == 0 ? (<>
                        <View
                            style={{
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                            <View>

                                <Image
                                    style={{
                                        width: deviceWidth * 0.8,
                                        resizeMode: 'contain',
                                    }}
                                    source={require('../img/empty-box-blue-icon.png')}
                                />

                            </View>



                        </View>
                        <View style={{
                            justifyContent: 'center',
                            width: deviceWidth,
                            height: deviceHeight + statusBarHeight,
                            alignContent: 'center',
                            position: 'absolute',
                        }}>
                            <Text style={styles.product_bottom_text}>
                                {Language.t('product.notFound')}
                            </Text>
                        </View>

                    </>) : (<>


                        <ScrollView
                            style={{
                                width: deviceWidth,
                                height: deviceHeight * 0.7,
                            }}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        >
                            <View style={{}}>
                                {
                                    data.map((item, index) => {
                                        return (index < 10 &&
                                            <>
                                                <View style={{ padding: deviceWidth * 0.01 }}>
                                                    <TouchableOpacity style={styles.basket_bg_btn}
                                                        onPress={() => navigation.navigate('ProductOrder', { backPage: backPage, backPageItem: data, route: item })}>
                                                        <View
                                                            style={styles.basket_img_view}>
                                                            {item.IMAGE64 == "" ? <Image
                                                                style={styles.basket_img}
                                                                source={require('../img/newproduct.png')}
                                                            /> : <Image
                                                                style={styles.basket_img}
                                                                source={{ uri: `data:image/png;base64,${item.IMAGE64}` }}
                                                            />}
                                                        </View>

                                                        <View
                                                            style={styles.basket_obj_view}>
                                                            <View
                                                                style={{
                                                                    flexDirection: 'row',
                                                                    justifyContent: 'space-between',
                                                                }}>

                                                                <Text style={styles.textLight}>
                                                                    {Language.getLang() == 'th' ? item.SHWC_ALIAS : item.SHWC_EALIAS}
                                                                </Text>
                                                                <TouchableOpacity
                                                                    onPress={() => onPressDelete(item.KEY)}
                                                                    style={{
                                                                        padding: 2,
                                                                        width: deviceWidth * 0.1,
                                                                        height: deviceWidth * 0.1,
                                                                    }}
                                                                >
                                                                    <Image
                                                                        source={
                                                                            require('../img/iconsMenu/trash.png')
                                                                        }
                                                                        style={{
                                                                            resizeMode: 'contain',
                                                                            width: deviceWidth * 0.04,
                                                                            height: deviceWidth * 0.05,
                                                                        }}
                                                                    />
                                                                </TouchableOpacity>
                                                            </View>

                                                            <View
                                                                style={{
                                                                    flexDirection: 'row',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                }}>

                                                                <Text
                                                                    style={styles.textLight_red}
                                                                >
                                                                    {`${item.NORMARPLU_U_PRC == '' ? safe_Format.currencyFormat(0) : safe_Format.currencyFormat(item.NORMARPLU_U_PRC)} .- `}
                                                                </Text>

                                                                <View style={{
                                                                    width: deviceWidth * 0.35,
                                                                    height: deviceHeight * 0.05,
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    flexDirection: 'row',
                                                                }}>

                                                                    <TouchableOpacity
                                                                        disabled={item.QTY > 1 ? false : true}
                                                                        onPress={() => decreaseProduct(index)}
                                                                    >
                                                                        <View
                                                                            style={{
                                                                                width: deviceWidth * 0.1,
                                                                                height: deviceWidth * 0.1,
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                backgroundColor: Colors.buttonTextColor,
                                                                                borderRadius: deviceWidth * 0.1,
                                                                                borderBottomWidth: 1,
                                                                                borderColor: Colors.borderColor
                                                                            }}

                                                                        >
                                                                            <Text style={{
                                                                                fontFamily: 'Kanit-Light',
                                                                                fontSize: FontSize.large,
                                                                                color: item.QTY > 1 ? Colors.menuButton : Colors.borderColor
                                                                            }}
                                                                            >
                                                                                -
                                                                            </Text>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                    <View
                                                                        style={{
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            marginLeft: deviceWidth * 0.05,
                                                                            marginRight: deviceWidth * 0.05,
                                                                        }}

                                                                    >
                                                                        <Text style={{
                                                                            fontFamily: 'Kanit-Light',
                                                                            fontSize: FontSize.medium,
                                                                            color: Colors.menuButton
                                                                        }}
                                                                        >
                                                                            {item.QTY}
                                                                        </Text>
                                                                    </View>
                                                                    <TouchableOpacity
                                                                        onPress={() => increaseProduct(index)}
                                                                    >
                                                                        <View
                                                                            style={{
                                                                                width: deviceWidth * 0.1,
                                                                                height: deviceWidth * 0.1,
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                backgroundColor: Colors.buttonTextColor,
                                                                                borderRadius: deviceWidth * 0.1,
                                                                                borderBottomWidth: 1,
                                                                                borderColor: Colors.borderColor
                                                                            }}

                                                                        >
                                                                            <Text style={{
                                                                                fontFamily: 'Kanit-Light',
                                                                                fontSize: FontSize.large,
                                                                                color: Colors.menuButton
                                                                            }}
                                                                            >
                                                                                +
                                                                            </Text>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        )
                                    })}

                            </View>
                        </ScrollView>
                        <View style={{
                            width: deviceWidth,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            backgroundColor: Colors.fontColor2,
                            paddingBottom: deviceHeight * 0.08,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,

                        }}>
                            <View
                                style={{

                                    width: deviceWidth * 0.9,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    height: FontSize.large * 2,
                                }}
                            >
                                <Text style={{
                                    fontFamily: 'Kanit-Bold',
                                    fontSize: FontSize.large,
                                    color: Colors.inputText
                                }}
                                >
                                    {Language.t('product.totalPrice')}
                                </Text>
                                <View style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                }}>


                                    <Text style={{
                                        fontFamily: 'Kanit-Bold',
                                        fontSize: FontSize.large,
                                        color: Colors.headerColor
                                    }}>
                                        {`${amount == '' ? safe_Format.currencyFormat(0) : safe_Format.currencyFormat(amount)}`}
                                    </Text>
                                    <Text style={{
                                        fontFamily: 'Kanit-Bold',
                                        fontSize: FontSize.medium,
                                        color: Colors.textColor
                                    }}
                                    >

                                        {` ${Language.t('product.thb')}`}
                                    </Text>
                                </View>

                            </View>
                            <TouchableOpacity
                                onPress={() => calBasket()}
                                disabled={loading}
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <View
                                    style={{

                                        width: deviceWidth * 0.9,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        backgroundColor: loading ? Colors.borderColor : Colors.menuButton,
                                        height: deviceHeight * 0.07,
                                        borderRadius: 10,
                                    }}

                                >
                                    <Text style={{

                                        fontFamily: 'Kanit-Light',
                                        fontSize: FontSize.large,
                                        color: Colors.buttonTextColor
                                    }}
                                    >
                                        {Language.t('product.order')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </>)}
                </View>
                {loading && data.length > 0 && loadingScreen()}
            </View>

        )

    )
}



