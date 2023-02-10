

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

import { categorySelector, } from '../src/store/slices/categoryReducer';
import { promotionSelector, } from '../src/store/slices/promotionReducer';
import { bannerSelector, } from '../src/store/slices/bannerReducer';
import { activitySelector, } from '../src/store/slices/activityReducer';
import { newproductSelector, } from '../src/store/slices/newproductReducer';

import { useAppDispatch, useAppSelector } from '../src/store/store';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
let images: Array<[]> = []

const HomeScreen = ({ route }: any) => {
    const [GOODS_CODE, setGOODS_CODE] = useState('');
    const navigation = useNavigation();
    const categoryList = useAppSelector(categorySelector)
    const promotionList = useAppSelector(promotionSelector)
    const bannerList = useAppSelector(bannerSelector)
    const newproductList = useAppSelector(newproductSelector)
    const activityList = useAppSelector(activitySelector)

    console.log(`categoryList.categoryPage > ${categoryList.categoryPage}`)
    useEffect(() => {

    }, [])
    // useEffect(() => {

    //     console.log('index >> ', navigation.getState().routes[navigation.getState().index].name)

    //     const backAction = () => {
    //         if (navigation.getState().index == 0 && navigation.getState().routes[navigation.getState().index].name =='Home') {
    //             Alert.alert(`แจ้งเตือน`, `คุณต้องการออกจากโปรแกรมหรือไม่`, [
    //                 { text: `ยืนยัน`, onPress: () => BackHandler.exitApp() },
    //                 {
    //                     text: `ยกเลิก`,
    //                     onPress: () => null,
    //                     style: "cancel"
    //                 }
    //             ]);
    //             return true;
    //         };
    //     }
    //     const backHandler = BackHandler.addEventListener(
    //         "hardwareBackPress",
    //         backAction
    //     );

    //     return () => backHandler.remove();
    // }, []);

    return (
        <View>
            <View style={{ width: deviceWidth, height: deviceHeight - deviceWidth * 0.1 }}>
                <ScrollView style={{ height: deviceHeight }}>
                    <View >
                        <FlatSlider route={bannerList.bannerPage} />
                    </View>

                    <>
                        <FlatListCategory route={categoryList.categoryPage} />
                        <FlatListPromotion route={promotionList.promotionPage} />
                        <FlatListNewproduct route={newproductList.newproductContent} />
                        <FlatListActivity route={activityList.activityPage} />

                    </>
                </ScrollView>


            </View>
            <View style={styles.tabbar} >

                <View style={{
                    backgroundColor: '#fff', alignSelf: 'center', width: deviceWidth * 0.8,
                    justifyContent: 'center', borderRadius: FontSize.large * 2, flexDirection: 'row',
                }}>
                    <View style={{ padding: 10 }}  >
                        <Image
                            source={require('../img/iconsMenu/search.png')}
                            style={{
                                width: FontSize.large * 1.3,
                                height: FontSize.large * 1.3,
                            }}
                        />
                    </View>
                    <TextInput
                        style={{
                            flex: 8,
                            borderBottomColor: Colors.borderColor,
                            color: Colors.fontColor,
                            fontSize: FontSize.medium,
                        }}
                        placeholderTextColor={Colors.fontColorSecondary}
                        value={GOODS_CODE}

                        placeholder={`ค้นหา` + '..'}
                        onSubmitEditing={() => console.log(`fetchMotherData()`)}
                        onChangeText={(val) => {
                            setGOODS_CODE(val)
                        }} />
                    <TouchableOpacity style={{ padding: 10, }} onPress={() => console.log(`barcode()`)}>
                        <Image
                            source={require('../img/iconsMenu/barcode.png')}
                            style={{
                                width: FontSize.large * 1.3,
                                height: FontSize.large * 1.3,
                            }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{
                    width: deviceWidth * 0.1
                }}>
                    <TouchableOpacity style={{}} onPress={() => console.log(`barcode()`)}>
                        <Image
                            source={require('../img/iconsMenu/bell.png')}
                            style={{
                                width: FontSize.large * 1.5,
                                height: FontSize.large * 1.5,
                            }}
                        />
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
