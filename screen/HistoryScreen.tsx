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
 
import { FontSize } from '../src/styles/FontSizeHelper';
import { config, updateUserList, clearUserList, updateLoginList, clearLoginList } from '../src/store/slices/configReducer';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../src/store/store';
import * as safe_Format from '../src/styles/safe_Format';

import * as Keychain from 'react-native-keychain';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
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
        await fetch('http://worldtimeapi.org/api/timezone/Asia/Bangkok', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then(async (json) => {
                let datetime = new Date(json.utc_datetime)
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



            })

    }
    const fetchUserData = async (ODate: any, ToDate: any) => {
        console.log('FETCH /LookupErp');
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = JSON.parse(checkLoginToken.password)


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
                    Alert.alert(`แจ้งเตือน`, `${json.ReasonString}`, [
                        { text: `ยืนยัน`, onPress: () => console.log() }])
                }

            })
            .catch((error) => {
                Alert.alert(`แจ้งเตือน`, `${error}`, [
                    { text: `ยืนยัน`, onPress: () => console.log() }])
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
                    Alert.alert(`แจ้งเตือน`, `${json.ReasonString}`, [
                        { text: `ยืนยัน`, onPress: () => console.log() }])
                }

            })
            .catch((error) => {
                Alert.alert(`แจ้งเตือน`, `${error}`, [
                    { text: `ยืนยัน`, onPress: () => console.log() }])
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
                height: deviceHeight
            }}
        >
            <View

                style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    width: deviceWidth,
                    padding: deviceHeight * 0.02,
                    backgroundColor: Colors.backgroundLoginColorSecondary,
                    borderBottomWidth: 1,
                    borderColor: Colors.borderColor
                }}>
                <Text
                    style={{
                        fontSize: FontSize.medium,
                        color: Colors.menuButton,
                        fontWeight: 'bold',
                    }}>
                    รายละเอียด
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Text style={{
                        fontSize: FontSize.large,
                    }}
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
                                    color: HistoryTab == true ? '#0288D1' : 'black',
                                    paddingLeft: 20,
                                    fontSize: FontSize.medium,
                                }}>
                                ประวัติการซื้อ
                            </Text>
                        </TouchableOpacity>
                        <Text style={{}}>
                            /
                        </Text>
                        <TouchableOpacity
                         onPress={() => setHistoryTab(false)}>
                        <Text
                           
                            style={{
                                color: HistoryTab == true ? 'black' : '#0288D1',
                                paddingRight: 20,
                                fontSize: FontSize.medium,
                            }}>
                            ประวัติการแลกแต้ม
                        </Text>
                        </TouchableOpacity>
                        
                    </View>
                    {
                        HistoryTab ? <ScrollView>
                            {PurchaseLoading ? <ActivityIndicator
                                
                                animating={PurchaseLoading}
                                marginTop={deviceHeight * 0.25}
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
                                            <Text style={{
                                                color: 'black',
                                                fontSize: FontSize.medium,
                                            }}>
                                                เลขอ้างอิง # {items.MBP_REF}
                                            </Text>
                                            <View marginTop={10}>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                    }} >
                                                    <View width={(deviceWidth * 0.6) - 20}>
                                                        <Text style={{
                                                            color: 'black',
                                                            fontSize: FontSize.medium,
                                                        }}>
                                                            วันที่ซื้อ
                                                        </Text>
                                                    </View>
                                                    <View
                                                        width={(deviceWidth * 0.4) - 20}
                                                        style={{
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between'
                                                        }}>
                                                        <Text style={{
                                                            color: 'black',
                                                            fontSize: FontSize.medium,
                                                        }}>
                                                            ยอดแต้ม
                                                        </Text>
                                                        <Text style={{
                                                            color: 'black',
                                                            fontSize: FontSize.medium,
                                                        }}>
                                                            {safe_Format.pointFormat(items.MBP_POINT)}
                                                        </Text>
                                                    </View>

                                                </View>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                    }} >
                                                    <View width={(deviceWidth * 0.6) - 20}>
                                                        <Text style={{
                                                            color: 'black',
                                                            fontSize: FontSize.medium,
                                                        }}>
                                                            {safe_Format.dateFormat(items.MBP_DATE)} เวลา {safe_Format.timeFormat(items.MBP_TIME)}
                                                        </Text>
                                                    </View>
                                                    <View
                                                        width={(deviceWidth * 0.4) - 20}
                                                        style={{
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between'
                                                        }}>
                                                        <Text style={{
                                                            color: 'black',
                                                            fontSize: FontSize.medium,
                                                        }}>
                                                            ยอดบิล
                                                        </Text>
                                                        <Text style={{
                                                            color: 'black',
                                                            fontSize: FontSize.medium,
                                                        }}>
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
                                        marginBottom: 1
                                    }}
                                >
                                    <View
                                        marginBottom={10}
                                        width={deviceWidth - 20}
                                        style={{
                                            alignSelf: 'center',
                                        }}
                                    >
                                        <Text style={{
                                            color: 'black',
                                            fontSize: FontSize.medium,
                                        }}>
                                            ไม่พบข้อมูล
                                        </Text>
                                    </View>
                                </View>
                            }

                        </ScrollView> : <ScrollView>

                            {RedeemLoading ? <ActivityIndicator

                                animating={RedeemLoading}
                                marginTop={deviceHeight * 0.25}
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
                                                    borderBottomWidth: 0.2,
                                                }}
                                            >
                                                <Text style={{
                                                    color: 'black',
                                                    fontSize: FontSize.medium,
                                                }}>
                                                    เลขอ้างอิง # {items.MBP_REF}
                                                </Text>
                                                <View marginTop={10}>
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                        }} >
                                                        <View width={(deviceWidth * 0.4) - 20}>
                                                            <Text style={{
                                                                color: 'black',
                                                                fontSize: FontSize.medium,
                                                            }}>
                                                                แต้มในการแลก
                                                            </Text>
                                                        </View>
                                                        <View
                                                            width={(deviceWidth * 0.6) - 20}
                                                            style={{
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-between'
                                                            }}>
                                                            <Text style={{
                                                                color: 'black',
                                                                fontSize: FontSize.medium,
                                                            }}></Text>
                                                            <Text style={{
                                                                color: 'black',
                                                                fontSize: FontSize.medium,
                                                            }}>
                                                                {safe_Format.pointFormat(items.MBP_POINT)} พอยท์
                                                            </Text>
                                                        </View>

                                                    </View>
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                        }} >
                                                        <View width={(deviceWidth * 0.4) - 20}>
                                                            <Text style={{
                                                                color: 'black',
                                                                fontSize: FontSize.medium,
                                                            }}>
                                                                ใช้งานเมื่อ
                                                            </Text>
                                                        </View>
                                                        <View
                                                            width={(deviceWidth * 0.6) - 20}
                                                            style={{
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-between'
                                                            }}>
                                                            <Text style={{
                                                                color: 'black',
                                                                fontSize: FontSize.medium,
                                                            }}></Text>
                                                            <Text style={{
                                                                color: 'black',
                                                                fontSize: FontSize.medium,
                                                            }}>
                                                                {safe_Format.dateFormat(items.MBP_DATE)} เวลา {safe_Format.timeFormat(items.MBP_TIME)}
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
                                            marginBottom: 1
                                        }}
                                    >
                                        <View
                                            marginBottom={10}
                                            width={deviceWidth - 20}
                                            style={{
                                                width: deviceWidth - 20,
                                                marginBottom: 10,
                                                alignSelf: 'center',
                                            }}
                                        >
                                            <Text style={{
                                                color: 'black',
                                                fontSize: FontSize.medium,
                                            }}>
                                                ไม่พบข้อมูล
                                            </Text>
                                        </View>
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