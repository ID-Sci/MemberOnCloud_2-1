

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
import { Language, changeLanguage } from '../translations/I18n';
import * as Keychain from 'react-native-keychain';
import { config } from '../store/slices/configReducer';
import FlatListCategoryDropdown from '../components/FlatListCategoryDropdown';
import { categorySelector, } from '../store/slices/categoryReducer';
import { useAppSelector } from '../store/store';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import { newproductSelector, } from '../store/slices/newproductReducer';
import { styles } from '../styles/styles';

const ProductSearchScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const newproductList = useAppSelector(newproductSelector)
    const categoryList = useAppSelector(categorySelector)
    const ConfigList = useAppSelector(config)
    const [GOODS_CODE, setGOODS_CODE] = useState('');
    const [product, setProduct] = useState(newproductList.allproductList)
    const [productState, setProductState] = useState(false)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        if (route.params?.post) {
            setGOODS_CODE(route.params.post)
            setProductState(true)
        }
    }, [route.params?.data]);

    return (
        product && (
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
                        height: FontSize.large * 3,
                        backgroundColor: Colors.backgroundLoginColorSecondary,

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
                    <View style={{
                        backgroundColor: '#fff', alignSelf: 'center',
                        width: deviceWidth * 0.8,
                        justifyContent: 'center', borderRadius: FontSize.large * 2, flexDirection: 'row',
                    }}>
                        <View style={{ padding: 10 }}  >
                            <Image
                                source={require('../img/iconsMenu/search.png')}
                                style={{
                                    width: FontSize.large * 1.3,
                                    height: FontSize.large * 1.3,
                                    resizeMode: 'contain',
                                }}
                            />
                        </View>
                        <TextInput
                            style={styles.input_GOODS_CODE_Light_title}
                            placeholderTextColor={Colors.fontColorSecondary}
                            value={GOODS_CODE}

                            placeholder={`${Language.t('menu.search')}` + '..'}
                            onSubmitEditing={() => setProductState(true)}
                            onChangeText={(val) => {
                                setGOODS_CODE(val)
                            }} />
                        <TouchableOpacity style={{ padding: 10, }} onPress={() => navigation.navigate('Scanner', { route: 'ProductSearch', data: product })}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={styles.textLight_title}>{Language.t('menu.scan')}</Text>
                                <Image
                                    source={require('../img/iconsMenu/barcode.png')}
                                    style={{
                                        width: FontSize.large * 1.5,
                                        height: FontSize.large * 1.5,
                                        resizeMode: 'contain',
                                    }}
                                />
                            </View>

                        </TouchableOpacity>
                    </View>
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
                    height: deviceHeight - FontSize.large * 3,
                }}>

                    {product && product.length > 0 && productState ? (
                        <FlatListProductScreen route={product.filter((filteritem: any) => { return filteritem.GOODS_CODE.includes(GOODS_CODE) ||  filteritem.SHWC_ALIAS.includes(GOODS_CODE) || filteritem.SHWC_EALIAS.includes(GOODS_CODE) })} />
                    ) : !loading && productState && (
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
                            <Text style={styles.textLight_title}>
                            {Language.t('menu.notFound')}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        )

    )
}

export default ProductSearchScreen