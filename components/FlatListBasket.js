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
import Colors from '../src/styles/colors';
import { FontSize } from '../src/styles/FontSizeHelper';
import CurrencyInput from 'react-native-currency-input';
import { useAppDispatch, useAppSelector } from '../src/store/store'
import { updateBasket, updatePrepareDocumentt } from '../src/store/slices/basketReducer';
import { docinfoSelector } from '../src/store/slices/docinfoReducer';
import * as Keychain from 'react-native-keychain';
import { config, updateARcode } from '../src/store/slices/configReducer';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default FlatListBasket = ({ items, itemsERP, prepareDocument }) => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const [amount, setAmount] = useState(0)
    const [data, setData] = useState(items)
    const [dataItem, setDataItem] = useState(itemsERP)
    const [loading, setloading] = useState(false)
    const [createAR, setCreateAR] = useState(false)

    const [prepareDoc, setPrepareDoc] = useState(prepareDocument)
    const ConfigList = useAppSelector(config)
    const docinfoType = useAppSelector(docinfoSelector).docinfoPage[0].SHWPH_TTL_ECPTN

    useEffect(() => {
        setData(items)
        setDataItem(itemsERP)
        setPrepareDoc(prepareDocument)
    }, [items]);


    useEffect(() => {
        if (ConfigList.MB_LOGIN_GUID) {

            if (items.length > 0) {
             
                const ARCheck = async () => {

                    const { MB_CODE } = ConfigList.UserList
                    const checkLoginToken = await Keychain.getGenericPassword();
                    const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
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
                            if (json.ResponseCode == 200) {
                                let responseData = JSON.parse(json.ResponseData);
                                if (responseData.Ar000130.length > 0) {
                                    await dispatch(updateARcode(responseData.Ar000130[0].AR_CODE))

                                    await calBasket(responseData.Ar000130[0].AR_CODE)

                                } else createARfile()
                               
                            } else {
                                Alert.alert(`แจ้งเตือน`, `${json.ReasonString}`, [
                                    { text: `ยืนยัน`, onPress: () => setloading(false) }])
                            }
                        })
                        .catch((error) => {
                            Alert.alert(`แจ้งเตือน`, `${error}`, [
                                { text: `ยืนยัน`, onPress: () => setloading(false) }])
                            console.log('ERROR ' + error);
                        })

                }
                ARCheck();

            }
        } else {
            Alert.alert(`แจ้งเตือน`, `Login member`, [
                { text: `ยืนยัน`, onPress: () => console.log() }])
        }

    }, [dataItem]);


    const createARfile = async () => {
        const { MB_CODE, MB_PHONE, MB_EMAIL, MB_INTL, MB_NAME, MB_SURNME } = await ConfigList.UserList
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        let param = {
            AR_CODE: "/MB",
            AR_NAME: MB_NAME,
            AR_MBCODE: MB_CODE,
            AR_ENABLE: 'Y',
            ADDB_COMPANY: "ลูกหนี้ member",
            ADDB_PHONE: MB_PHONE,
            ADDB_EMAIL: MB_EMAIL,
            CT_INTL: MB_INTL,
            CT_NAME: MB_NAME,
            CT_SURNME: MB_SURNME,
            DFAR_TYPE: "1"
        }
        console.log(" ######## createARfile  #######", param)
        await fetch(configToken.WebService + '/CreateUpdateMaster', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'NEWARFILE',
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
                    console.log(" responseData createARfile  >>>", responseData)
                    await dispatch(updateARcode(responseData.AR_CODE))
                    await calBasket(responseData.AR_CODE)
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

    const calBasket = async (AR_CODE) => {
        await setloading(true)
        docinfoType == 'BK' && await calBasketSellOrder(AR_CODE)
        docinfoType == 'CS' && await calBasketInvoice(AR_CODE)
        docinfoType == 'DS' && await calBasketInvoice(AR_CODE)
        await setloading(false)

    }
    const saveBasket = async () => {
        await setloading(true) 
         
            docinfoType == 'BK' && await saveBasketSellOrder()
            docinfoType == 'CS' && await saveBasketInvoice()
            docinfoType == 'DS' && await saveBasketInvoice()
            await setloading(false)
        
    }
    const calBasketSellOrder = async (AR_CODE) => {
        let newDate = new Date()
        var d = newDate.getDate()
        var m = newDate.getMonth() + 1
        var y = newDate.getFullYear()
        let DI_DATE = y + (m <= 9 ? '0' + m : m) + d
        const param = {
            ErpUpdFunc: [
                {
                    ImpTrhHeader: {
                        DI_DATE: DI_DATE,
                        DI_REF: '<เลขถัดไป>',
                        DT_DOCCODE: docinfoType,
                        DT_PROPERTIES: '307',
                        VAT_REF: '<เลขเดียวกัน>',
                        VAT_DATE: DI_DATE,
                        AR_CODE: AR_CODE,
                        ARD_TDSC_KEYIN: '',
                        DI_REMARK: 'MEMBER APP',
                    },
                    ImpTrhDetail: dataItem
                },
            ],
        }
        console.log(" ######## calBasketSellOrder  #######", param)
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

    const saveBasketSellOrder = async () => {
        console.log("######## saveBasketSellOrder prepareDocument >>>", prepareDocument)
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        await fetch(configToken.WebService + '/UpdateErp', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'SaveSellOrderDocinfo',
                'BPAPUS-PARAM': JSON.stringify(prepareDocument),
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
                    Alert.alert(`แจ้งเตือน`, `สั่งซื้อสำเร็จ`, [
                        { text: `ยืนยัน`, onPress: () => navigation.goBack() }])
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
    const calBasketInvoice = async (AR_CODE) => {
        let newDate = new Date()
        var d = newDate.getDate()
        var m = newDate.getMonth() + 1
        var y = newDate.getFullYear()
        let DI_DATE = y + (m <= 9 ? '0' + m : m) + d
        const param = {
            ErpUpdFunc: [
                {
                    ImpTrhHeader: {
                        DI_DATE: DI_DATE,
                        DI_REF: '<เลขถัดไป>',
                        DT_DOCCODE: docinfoType,
                        DT_PROPERTIES: '307',
                        VAT_REF: '<เลขเดียวกัน>',
                        VAT_DATE: DI_DATE,
                        AR_CODE: AR_CODE,
                        ARD_TDSC_KEYIN: '',
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

    const saveBasketInvoice = async () => {
        console.log("######## saveBasketInvoice prepareDocument >>>", prepareDocument)
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        await fetch(configToken.WebService + '/UpdateErp', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'SaveInvoiceDocinfo',
                'BPAPUS-PARAM': JSON.stringify(prepareDocument),
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
                    Alert.alert(`แจ้งเตือน`, `สั่งซื้อสำเร็จ`, [
                        { text: `ยืนยัน`, onPress: () => navigation.goBack() }])
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
    console.log(data.length)

    const loadingScreen = () => {
        return (
            <View
                style={{
                    width: deviceWidth,
                    height: deviceHeight,
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
                                    resizeMode={'contain'}
                                    source={require('../img/empty-box-blue-icon.png')}
                                />

                            </View>



                        </View>
                        <View style={{
                            justifyContent: 'center',
                            width: deviceWidth,
                            height: deviceHeight,
                            alignContent: 'center',
                            position: 'absolute',
                        }}>
                            <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>
                                ไม่พบรายการสินค้า
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
                                                    <TouchableOpacity style={{
                                                        backgroundColor: '#fff', alignSelf: 'center',
                                                        justifyContent: 'center', flexDirection: 'row',
                                                        height: deviceWidth * 0.33,
                                                        width: deviceWidth * 0.9,
                                                        shadowColor: "#000",
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 2,
                                                        },
                                                        shadowOpacity: 0.25,
                                                        shadowRadius: 3.84,

                                                        elevation: 5,
                                                        borderRadius: deviceWidth * 0.05,
                                                    }}
                                                        onPress={() => navigation.navigate('ProductOrder', { route: item })}>
                                                        <View
                                                            style={{
                                                                width: '25%',
                                                                height: deviceHeight * 0.2,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}>
                                                            {item.IMAGE64 == "" ? <Image
                                                                style={{
                                                                    shadowColor: '#000',
                                                                    shadowOffset: { width: 0, height: 2 },
                                                                    shadowOpacity: 0.8,
                                                                    shadowRadius: 2,
                                                                    resizeMode: 'contain',
                                                                    height: deviceWidth * 0.12,
                                                                    width: deviceWidth * 0.18,
                                                                }}
                                                                source={require('../img/newproduct.png')}
                                                            /> : <Image
                                                                style={{
                                                                    shadowColor: '#000',
                                                                    shadowOffset: { width: 0, height: 2 },
                                                                    shadowOpacity: 0.8,
                                                                    shadowRadius: 2,
                                                                    resizeMode: 'contain',
                                                                    height: deviceHeight * 0.12,
                                                                    width: deviceWidth * 0.18,
                                                                }}
                                                                source={{ uri: `data:image/png;base64,${item.IMAGE64}` }}
                                                            />}
                                                        </View>

                                                        <View
                                                            style={{
                                                                width: '75%',
                                                                paddingVertical: 20,
                                                                paddingHorizontal: 20,
                                                                justifyContent: 'space-between',
                                                            }}>
                                                            <View
                                                                style={{
                                                                    flexDirection: 'row',
                                                                    justifyContent: 'space-between',
                                                                }}>

                                                                <Text style={{
                                                                    width: '90%',
                                                                    textAlign: 'left',
                                                                }}>
                                                                    {item.SHWC_ALIAS}
                                                                </Text>
                                                                <TouchableOpacity
                                                                    onPress={() => onPressDelete(item.KEY)}
                                                                    style={{
                                                                        padding: 2,
                                                                        width: deviceWidth * 0.08,
                                                                        height: deviceWidth * 0.06,
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
                                                                <CurrencyInput
                                                                    editable={false}
                                                                    delimiter=","
                                                                    separator="."
                                                                    precision={2}
                                                                    color={'red'}
                                                                    fontSize={FontSize.medium}
                                                                    placeholderTextColor={Colors.fontColor}
                                                                    value={item.NORMARPLU_U_PRC == '' ? 0 : item.NORMARPLU_U_PRC}
                                                                    multiline={true}
                                                                    textAlign={'center'}
                                                                />
                                                                <Text
                                                                    style={{
                                                                        color: 'red',
                                                                        fontSize: FontSize.medium
                                                                    }}
                                                                >
                                                                    {`. - `}
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
                                    fontSize: FontSize.large,
                                    fontWeight: 'bold',
                                    color: Colors.inputText
                                }}
                                >
                                    {`ราคารวม `}
                                </Text>
                                <View style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                }}>

                                    <CurrencyInput
                                        editable={false}
                                        delimiter=","
                                        separator="."
                                        precision={2}
                                        color={loading ? Colors.borderColor : Colors.menuButton}
                                        fontSize={FontSize.large}
                                        fontWeight={'bold'}
                                        placeholderTextColor={Colors.itemColor}
                                        value={amount}
                                        multiline={true}
                                        textAlign={'center'}
                                    />

                                    <Text style={{
                                        fontSize: FontSize.medium,
                                        color: Colors.textColor
                                    }}
                                    >

                                        {` บาท`}
                                    </Text>
                                </View>

                            </View>
                            <TouchableOpacity
                                onPress={() => saveBasket()}
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
                                        fontSize: FontSize.large,
                                        color: Colors.buttonTextColor
                                    }}
                                    >
                                        {`สั่งซื้อ`}
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



