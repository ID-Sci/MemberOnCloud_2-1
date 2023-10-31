

import React, { useState, useEffect } from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    Dimensions,
    FlatList,
    Text,
    BackHandler,
    Image,
    Alert,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontSize } from '../styles/FontSizeHelper';
import { Language, changeLanguage } from '../translations/I18n';
import { styles,statusBarHeight, deviceWidth,deviceHeight} from '../styles/styles';

export default FlatListCategoryDropdown = ({ route, onPressCategory }) => {
    const [CategoryItem, setCategoryItem] = useState(route.ExtarItem);
    const [CategoryModel, setCategoryModel] = useState(false);
    const setThisState = (item) => {
        setCategoryModel(!CategoryModel)
        setCategoryItem(item)
        onPressCategory(item)
    }
    const renderItem = ({ item, onPress, backgroundColor, textColor }) => (
        <View style={{}}>
            <TouchableOpacity
                style={styles.category_dropdownlist}
                onPress={() => setThisState(item)}>
                <View style={{
                    width: deviceWidth * 0.1,
                    alignItems: 'flex-end'
                }}>
                    <Image
                        style={styles.category_image_title}
                        source={{ uri: `data:image/png;base64,${item.IMAGE64}` }}
                    />
                </View>
                <View
                    style={{
                        width: deviceWidth * 0.9,
                        alignItems: 'flex-start'
                    }}>
                    <Text style={styles.category_bottom_text}>
                        {Language.getLang() == 'th' ? `${item.SHWPH_TTL_CPTN}` : `${item.SHWPH_TTL_ECPTN}`}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
    return (route &&
        (
            <SafeAreaView style={{ marginTop: (FontSize.large * 2) + statusBarHeight, position: 'absolute', }} >
                {CategoryModel ? (
                    <View >
                        <FlatList
                            data={route.CategoryItem}
                            renderItem={renderItem}
                            keyExtractor={item => item.SHWPH_GUID}
                            extraData={CategoryItem}
                        />

                        <TouchableOpacity
                            style={styles.category_dropdownlist}
                            onPress={() => setThisState('ALL')}>
                            <View width={deviceWidth * 0.1}>

                            </View>
                            <Text style={styles.category_bottom_text}>
                                - ALL -
                            </Text>
                            <View width={deviceWidth * 0.9}>

                            </View>
                        </TouchableOpacity>

                    </View>

                ) : (
                    CategoryItem == 'ALL' ? (
                        <View>

                            <TouchableOpacity
                                style={styles.category_dropdownlist}
                                onPress={() => setCategoryModel(!CategoryModel)}>
                                <View width={deviceWidth * 0.1}>

                                </View>
                                <Text style={styles.category_bottom_text}>
                                    - ALL -
                                </Text>
                              

                                <View width={deviceWidth * 0.9}>

                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View>

                            <TouchableOpacity
                                style={styles.category_dropdownlist}
                                onPress={() => setCategoryModel(!CategoryModel)}>
                                <View style={{
                                    width: deviceWidth * 0.1,
                                    alignItems: 'flex-end'
                                }}>
                                    <Image
                                        style={styles.category_image_title}
                                        source={{ uri: `data:image/png;base64,${CategoryItem.IMAGE64}` }}
                                    />
                                </View>
                                <View
                                    style={{
                                        width: deviceWidth * 0.9,
                                        alignItems: 'flex-start'
                                    }}>
                                    <Text style={styles.category_bottom_text}>
                                        {Language.getLang() == 'th' ? `${CategoryItem.SHWPH_TTL_CPTN}` : `${CategoryItem.SHWPH_TTL_ECPTN}`}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )

                )}
            </SafeAreaView>

        )
    )
}

