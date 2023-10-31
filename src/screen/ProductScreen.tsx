

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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontSize } from '../styles/FontSizeHelper';
import CurrencyInput from 'react-native-currency-input';
import FlatListProductScreen from '../components/FlatListProductScreen';
import AbsoluteBasket from './AbsoluteBasket'
import { BorderlessButton } from 'react-native-gesture-handler';
import { styles,statusBarHeight, deviceWidth,deviceHeight} from '../styles/styles';

const ProductScreen = ({ route }: any) => {
    const navigation = useNavigation();
    return (route.params.route &&
        (
            <View
                style={{
                    width: deviceWidth,
                    height: deviceHeight+statusBarHeight
                }}
            >

                <View style={styles.header}>
                    <Text
                        style={styles.header_text_title}>
                        {route.params.name}
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.header_text_Xtitle}
                        >
                            x
                        </Text>
                    </TouchableOpacity>
                </View>
                <FlatListProductScreen backPage={route.params.backPage} name={route.params.name} route={route.params.route} />
                <AbsoluteBasket/>
            </View>)
    )
}

export default ProductScreen