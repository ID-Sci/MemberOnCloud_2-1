

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
import CurrencyInput from 'react-native-currency-input';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default FlatListShowTemppageScreen = ({ route }) => {
    const navigation = useNavigation();
    return (route &&
        (
            <ScrollView
                style={{
                    width: deviceWidth,
                    height: deviceHeight  
                }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                {route.map((item, index) => {
                    return (index < 10 &&
                        <>
                            <View style={{ padding: deviceWidth * 0.01 }}>
                                <TouchableOpacity style={{
                                    backgroundColor: '#fff', alignSelf: 'center',
                                    justifyContent: 'center', flexDirection: 'row',
                                    height: deviceWidth * 0.6,
                                    width: deviceWidth * 0.9,
                                    borderRadius: deviceWidth * 0.05,
                                }}
                                onPress={() => navigation.navigate('Temppage', { name: 'โปรโมชั่นแนะนำ', route: item })}>
                                    <Image
                                        style={{
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            shadowRadius: 2,
                                            height: deviceWidth * 0.6,
                                            width: deviceWidth * 0.9,
                                            borderRadius: deviceWidth * 0.05,
                                        }}
                                        source={{ uri: `data:image/png;base64,${item.IMAGE64}` }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </>
                    )
                })}


            </ScrollView>)
    )
}

