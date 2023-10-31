

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
import FlatListShowTemppageScreen from '../components/FlatListShowTemppageScreen';
import { BorderlessButton } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles,statusBarHeight, deviceWidth,deviceHeight} from '../styles/styles';
const ShowTemppageScreen = ({ route }: any) => {
    const navigation = useNavigation();

    return (route.params.route &&
        (
            <View
                style={{
                    width: deviceWidth,
                    height: deviceHeight + statusBarHeight,
                    backgroundColor: Colors.backgroundLoginColorSecondary,

                }}
            >

                <View

                    style={styles.header}>
                    <Text
                        style={styles.header_text_title}>
                        {route.params.name}
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.header_text_Xtitle}>
                            X
                        </Text>
                    </TouchableOpacity>
                </View>
                <FlatListShowTemppageScreen route={route.params.route} />
            </View>)
    )
}

export default ShowTemppageScreen 