

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

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontSize } from '../styles/FontSizeHelper';
import * as Keychain from 'react-native-keychain';
import { useAppDispatch, useAppSelector } from '../store/store';
import { config, updateUserList, updateMB_LOGIN_GUID, clearUserList, updateLoginList, clearLoginList } from '../store/slices/configReducer';
import { styles } from '../styles/styles';
import Colors from '../styles/colors';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default FlatListCategory = ({ route, onPressCategory }) => {
    return (route &&
        (<ScrollView
            paddingTop={deviceWidth * 0.03}
            height={deviceWidth * 0.3}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false} >
            {route.map((item, index) => {
                return (
                    <>
                        <View style={{ width: deviceWidth * 0.2, height: deviceWidth * 0.4, }}>
                            <TouchableOpacity style={styles.category_bottom_shadow}
                                onPress={() => onPressCategory(item)}>
                                <Image
                                    style={styles.category_image_title}
                                    source={{ uri: `data:image/png;base64,${item.IMAGE64}` }}
                                />
                            </TouchableOpacity>
                            <Text style={styles.category_bottom_text_title}>
                                {`${item.SHWPH_TTL_CPTN}`}
                            </Text>
                        </View>
                    </>
                )
            })}
            <View style={{ width: deviceWidth * 0.2, height: deviceWidth * 0.3, }}>
                <TouchableOpacity  style={styles.category_bottom_shadow}
                    onPress={() => onPressCategory('ALL')}>
                    <View style={{
                        height: deviceWidth * 0.1,
                        width: deviceWidth * 0.1,
                        alignSelf: 'center',
                        justifyContent: 'center',
                    }}>
                        <Text style={styles.category_bottom_text}>
                            ALL
                        </Text>
                    </View>

                </TouchableOpacity>
                <Text style={styles.category_bottom_text_title}>
                    {`ทั้งหมด`}
                </Text>
            </View>
        </ScrollView>)
    )
}

