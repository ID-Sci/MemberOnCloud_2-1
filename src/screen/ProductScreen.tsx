

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
import { BorderlessButton } from 'react-native-gesture-handler';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const ProductScreen = ({ route }: any) => {
    const navigation = useNavigation();
    return (route.params.route &&
        (
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
                        {route.params.name}
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
                <FlatListProductScreen route={route.params.route} />
            </View>)
    )
}

export default ProductScreen 