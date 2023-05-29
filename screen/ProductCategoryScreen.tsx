

import React, { useState, useEffect } from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    FlatList,
    Dimensions,
    Text,
    BackHandler,
    Image,
    Alert,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../src/styles/colors';
import { FontSize } from '../src/styles/FontSizeHelper';
import FlatListProductScreen from '../components/FlatListProductScreen';

import * as Keychain from 'react-native-keychain';
import { config } from '../src/store/slices/configReducer';
import FlatListCategoryDropdown from '../components/FlatListCategoryDropdown';
import { categorySelector, } from '../src/store/slices/categoryReducer';
import { useAppSelector } from '../src/store/store';
import { newproductSelector, } from '../src/store/slices/newproductReducer';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const ProductCategoryScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const categoryList = useAppSelector(categorySelector)
    const newproductList = useAppSelector(newproductSelector)
    const ConfigList = useAppSelector(config)
    const [product, setProduct] = useState([])
    const [category, setCategory] = useState(route.params.route)
    const [loading, setLoading] = useState(false)
    console.log(`category >> ${category.SHWPH_GUID}`)

    useEffect(() => {
        getProducrCategory();
    }, [category]);

    const getProducrCategory = async () => {
        await setLoading(true)
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null

        if (category == 'ALL') {
     
          setProduct(newproductList.allproductList)

        } else {
            await fetch(configToken.WebService + '/ECommerce', {
                method: 'POST',
                body: JSON.stringify({
                    'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                    'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                    'BPAPUS-FUNCTION': 'GetPage',
                    'BPAPUS-PARAM':
                        '{"SHWP_GUID": "' +
                        category.SHWPH_GUID +
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
                        setProduct(responseData.SHOWCONTENT)
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
        await setLoading(false)
    }
    return (
        category && (
            <View
                style={{
                    width: deviceWidth,
                    height: deviceHeight
                }}>
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        width: deviceWidth,
                        paddingLeft: FontSize.large,
                        paddingRight: FontSize.large,
                        height: FontSize.large * 2,
                        backgroundColor: Colors.backgroundLoginColorSecondary,
                        borderBottomWidth: 1,
                        borderColor: Colors.borderColor
                    }}>
                     <TouchableOpacity onPress={() => navigation.goBack()}>
                        <View style={{ width: deviceWidth * 0.1, flexDirection: 'row', alignItems: 'center', }}>

                            <Image
                                source={require('../img/iconsMenu/goback.png')}
                                style={{
                                    width: FontSize.large * 1.5,
                                    height: FontSize.large * 1.5,
                                    resizeMode: 'contain',
                                }}
                            />
                        </View>

                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: FontSize.medium,
                            color: Colors.menuButton,
                            fontWeight: 'bold',
                        }}>
                        {route.params.name}
                    </Text>
                    <TouchableOpacity style={{
                    width: deviceWidth * 0.1, flexDirection: 'row', alignItems: 'center',
                }}
                    onPress={() => navigation.navigate('ProductSearch', { name: 'ค้นหา' })}
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
                    </TouchableOpacity>
                </View>


                {loading &&
                    <Modal
                        transparent={true}
                        animationType={'none'}
                        visible={loading}
                        onRequestClose={() => { }}>
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                flexDirection: 'column',
                            }}>
                            <View
                                style={{
                                    backgroundColor: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                    height: 100,
                                    width: 100,
                                    borderRadius: deviceWidth * 0.05
                                }}>
                                <ActivityIndicator
                                    animating={loading}
                                    size="large"
                                    color={Colors.lightPrimiryColor} />
                            </View>
                        </View>
                    </Modal>
                }
                <View style={{
                    marginTop: FontSize.large * 2,
                    height: deviceHeight - FontSize.large * 4,
                }}>

                    {product && product.length > 0 ? (
                        <FlatListProductScreen route={product} />
                    ) : !loading && (
                        <View
                            style={{
                                height: deviceHeight - FontSize.large * 4,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <Image
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowRadius: 2,
                                    height: deviceWidth * 0.3,
                                    width: deviceWidth * 0.3,
                                    resizeMode: 'contain',
                                }}
                                source={require('../img/empty-box-blue-icon.png')}
                            />
                            <Text style={{
                                textAlign: 'center'
                            }}>
                                ไม่มีสินค้าในหมวดนี้
                            </Text>
                        </View>
                    )}
                </View>


                <FlatListCategoryDropdown route={{ CategoryItem: categoryList.categoryPage, ExtarItem: category }} onPressCategory={(item: any) => setCategory(item)} />
            </View>
        )

    )
}

export default ProductCategoryScreen