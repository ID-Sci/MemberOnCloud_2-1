

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
import Colors from '../src/styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontSize } from '../src/styles/FontSizeHelper';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

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
                style={{
                    width: deviceWidth,
                    height: FontSize.large * 2,
                    backgroundColor: '#fff', alignItems: 'center',
                    flexDirection: 'row',
                    backgroundColor: Colors.borderColor
                }}
                onPress={() => setThisState(item)}>
                <View width={deviceWidth * 0.1}>

                </View>
                <Image
                    style={{
                        height: deviceWidth * 0.1,
                        width: deviceWidth * 0.1,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        resizeMode: 'contain',
                    }}
                    source={{ uri: `data:image/png;base64,${item.IMAGE64}` }}
                />
                <Text style={{
                    fontFamily: 'Kanit-Light',
                }}>
                    {item.SHWPH_TTL_CPTN}
                </Text>
                <View width={deviceWidth * 0.1}>

                </View>
            </TouchableOpacity>
        </View>
    );
    return (route &&
        (
            <SafeAreaView style={{ marginTop: FontSize.large * 2, position: 'absolute', }} >
                {CategoryModel ? (
                    <View>
                        <FlatList
                            data={route.CategoryItem}
                            renderItem={renderItem}
                            keyExtractor={item => item.SHWPH_GUID}
                            extraData={CategoryItem}
                        />
                        <View  >
                            <TouchableOpacity
                                style={{
                                    width: deviceWidth,
                                    height: FontSize.large * 2,
                                    backgroundColor: '#fff', alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',

                                    backgroundColor: Colors.borderColor
                                }}
                                onPress={() => setThisState('ALL')}>
                                <View width={deviceWidth * 0.1}>

                                </View>
                                <Text>
                                    - ALL -
                                </Text>
                                <View width={deviceWidth * 0.1}>

                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                ) : (
                    CategoryItem == 'ALL' ? (
                        <View>

                            <TouchableOpacity
                                style={{
                                    width: deviceWidth,
                                    height: FontSize.large * 2,
                                    backgroundColor: '#fff', alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    backgroundColor: Colors.borderColor
                                }}
                                onPress={() => setCategoryModel(!CategoryModel)}>
                                <View width={deviceWidth * 0.1}>

                                </View>

                                <Text>
                                    - ALL -
                                </Text>
                                <View width={deviceWidth * 0.1}>

                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View>

                            <TouchableOpacity
                                style={{
                                    width: deviceWidth,
                                    height: FontSize.large * 2,
                                    backgroundColor: '#fff', alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    backgroundColor: Colors.borderColor
                                }}
                                onPress={() => setCategoryModel(!CategoryModel)}>
                                <View width={deviceWidth * 0.5}>
                                <Image
                                    style={{
                                        height: deviceWidth * 0.1,
                                        width: deviceWidth * 0.1,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowRadius: 2,
                                        resizeMode: 'contain',
                                    }}
                                    source={{ uri: `data:image/png;base64,${CategoryItem.IMAGE64}` }}
                                />
                                </View>

                               
                                
                                <View width={deviceWidth * 0.5}>
                                <Text>
                                    {CategoryItem.SHWPH_TTL_CPTN}
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

