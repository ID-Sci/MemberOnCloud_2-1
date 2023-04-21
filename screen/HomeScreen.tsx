

import React, { useState, useEffect } from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    Dimensions,
    Text,
    BackHandler,
    Image,
    Alert,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../src/styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontSize } from '../src/styles/FontSizeHelper';
import FlatSlider from '../components/FlatListSlider';
import FlatListCategory from '../components/FlatListCategory';
import FlatListPromotion from '../components/FlatListPromotion';
import FlatListNewproduct from '../components/FlatListNewproduct';
import FlatListActivity from '../components/FlatListActivity';

import * as Keychain from 'react-native-keychain';
import { config } from '../src/store/slices/configReducer';
import { notificationSelector, } from '../src/store/slices/notificationReducer';
import { categorySelector, } from '../src/store/slices/categoryReducer';
import { promotionSelector, } from '../src/store/slices/promotionReducer';
import { bannerSelector, } from '../src/store/slices/bannerReducer';
import { activitySelector, } from '../src/store/slices/activityReducer';
import { newproductSelector, } from '../src/store/slices/newproductReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from '../src/store/store';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
let images: Array<[]> = []

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
    const [notivalue, setNotivalue] = useState(AsyncStorage.getItem('noti') == null ? '0' : AsyncStorage.getItem('noti'))
    useEffect(() => {
        getNotiData()
    }, [])

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
        await navigation.navigate('ShowTemppage', { name: 'แจ้งเตือน', route: notificationList.notificationPage })
    }
    const getProducrCategory = async (item: any) => {
        navigation.navigate('ProductCategory', { name: 'หมวดหมู่', route: item })
    }
    return (
        <View>
            <View style={{ width: deviceWidth, height: deviceHeight }}>
                <ScrollView style={{ height: deviceHeight }}>
                    <View >

                        <FlatSlider route={bannerList.bannerPage} />
                    </View>
                    <>
                        <FlatListCategory route={categoryList.categoryPage} onPressCategory={(item: any) => getProducrCategory(item)} />
                        <FlatListPromotion route={promotionList.promotionPage} />
                        <FlatListNewproduct route={newproductList.newproductContent} />
                        <FlatListActivity route={activityList.activityPage} />
                    </>
                </ScrollView>
            </View>
            <View style={styles.tabbar} >
                <TouchableOpacity style={{
                    backgroundColor: '#fff', alignSelf: 'center', width: deviceWidth * 0.8,
                    justifyContent: 'center', borderRadius: FontSize.large * 2, flexDirection: 'row',
                    alignItems: 'center',
                }}
                    onPress={() => navigation.navigate('ProductSearch', { name: 'ค้นหา' })}
                >
                    <View style={{ padding: 10 }}  >
                        <Image
                            source={require('../img/iconsMenu/search.png')}
                            style={{
                                width: FontSize.large * 1.3,
                                height: FontSize.large * 1.3,
                            }}
                        />
                    </View>
                    <Text
                        style={{
                            flex: 8,
                            borderBottomColor: Colors.borderColor,
                            color: Colors.fontColor,
                            fontSize: FontSize.medium,
                        }}
                    >
                        {`ค้นหา` + '..'}
                    </Text>
                    <View style={{ padding: 10, }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Text style={{ fontSize: FontSize.mini * 2 }}>สแกน</Text>
                            <Image
                                source={require('../img/iconsMenu/barcode.png')}
                                style={{
                                    width: FontSize.large * 1.5,
                                    height: FontSize.large * 1.5,
                                }}
                            />
                        </View>

                    </View>
                </TouchableOpacity>
                <View style={{
                    width: deviceWidth * 0.1
                }}>

                    <TouchableOpacity style={{}} onPress={() =>
                        setNotiData()}>


                        <Image
                            source={require('../img/iconsMenu/bell.png')}
                            style={{
                                width: FontSize.large * 1.5,
                                height: FontSize.large * 1.5,
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
        width: deviceWidth,
        height: FontSize.large * 3,
        paddingTop: deviceWidth * 0.03,
        paddingLeft: deviceWidth * 0.03,
        paddingRight: deviceWidth * 0.03,
        alignItems: 'center',
        position: 'absolute',
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

export default HomeScreen;
