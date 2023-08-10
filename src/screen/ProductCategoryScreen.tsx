

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
import Colors from '../styles/colors';
import { FontSize } from '../styles/FontSizeHelper';
import FlatListProductScreen from '../components/FlatListProductScreen';
import AbsoluteBasket from './AbsoluteBasket';
import * as Keychain from 'react-native-keychain';
import { config } from '../store/slices/configReducer';
import FlatListCategoryDropdown from '../components/FlatListCategoryDropdown';
import { categorySelector, } from '../store/slices/categoryReducer';
import { useAppSelector } from '../store/store';
import { newproductSelector, } from '../store/slices/newproductReducer';
import { basketSelector } from '../store/slices/basketReducer';

import { styles } from '../styles/styles';
import { Language, changeLanguage } from '../translations/I18n';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const ProductCategoryScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const categoryList = useAppSelector(categorySelector)
    const newproductList = useAppSelector(newproductSelector)
    const basketProduct = useAppSelector(basketSelector)
    const ConfigList = useAppSelector(config)
    const [product, setProduct] = useState([[]])
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
                    style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <View style={{ width: deviceWidth * 0.1, flexDirection: 'row', alignItems: 'center', }}>

                            <Image
                                source={require('../img/iconsMenu/goback.png')}
                                style={styles.icon}
                            />
                        </View>

                    </TouchableOpacity>
                    <Text
                        style={styles.header_text_title}>
                        {route.params.name}
                    </Text>
                    <TouchableOpacity style={{
                        width: deviceWidth * 0.1,
                    }}
                        onPress={() => navigation.navigate('ProductSearch' as never, { name: 'ค้นหา' } as never)}
                    >
                        <View style={{ padding: 10 }}  >
                            <Image
                                source={require('../img/iconsMenu/search.png')}
                                style={styles.icon}
                            />
                        </View>
                    </TouchableOpacity>
                </View>


                {loading ?
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
                                style={styles.activityIndicator}>
                                <ActivityIndicator
                                    animating={loading}
                                    size="large"
                                    color={Colors.lightPrimiryColor} />
                            </View>
                        </View>
                    </Modal> :
                    <View style={{
                        marginTop: FontSize.large * 2,
                        height: deviceHeight - FontSize.large * 4,
                    }}>

                        {product && product.length > 0 ? (
                            <FlatListProductScreen backPage={'ProductCategory'} route={product} />
                        ) : !loading && (
                            <View
                                style={{
                                    height: deviceHeight - FontSize.large * 4,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Image
                                    style={styles.iconmainObj}
                                    source={require('../img/empty-box-blue-icon.png')}
                                />
                                <Text style={styles.textLight_title}>
                                    {Language.t('menu.notFound')}
                                </Text>
                            </View>
                        )}
                    </View>
                }



                <FlatListCategoryDropdown route={{ CategoryItem: categoryList.categoryPage, ExtarItem: category }} onPressCategory={(item: any) => setCategory(item)} />
                <AbsoluteBasket />
            </View>
        )

    )
}

export default ProductCategoryScreen