

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
import Colors from '../src/styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontSize } from '../src/styles/FontSizeHelper';
import CurrencyInput from 'react-native-currency-input';
import FlatListPromotion from '../components/FlatListPromotion';
import { BorderlessButton } from 'react-native-gesture-handler';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const TemppageScreen = ({ route }: any) => {
    const navigation = useNavigation()
    const [order, setOrder] = useState(1)
    const item = route.params.route
    console.log(item.SHWC_GUID)
    return (route.params.route &&
        (
            <View style={{ alignItems: 'flex-end' }}>
                <View style={{
                    width: deviceWidth,
                    height: deviceHeight,
                }}>
                    <ScrollView
                        style={{
                            width: deviceWidth,
                            height: deviceHeight ,
                            backgroundColor: '#fff',
                        }}
                    >
                        <View style={{}}>

                            <View
                                style={{ 
                                    height: deviceWidth*0.6
                                }}>
                               <Image
                                    style={{
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                    
                                        shadowRadius: 2,
                                        height: deviceWidth*0.6,
                                        width: deviceWidth, 
                                    }}
                                    source={{ uri: `data:image/png;base64,${item.IMAGE64}` }}
                                />
                            </View>
                             <View
                                style={{
                                    padding: deviceWidth * 0.1
                                }}>
                                <View
                                    style={{
                                    
                                    }}
                                >
                                    <Text style={{
                                        fontSize: FontSize.medium,
                                        fontWeight: 'bold',
                                        color: Colors.fontColor

                                    }}>
                                       {item.SHWPH_EXPLAIN}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{

                        padding: deviceWidth * 0.025,
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                    }}
                >
                    <View
                        style={{
                            height: deviceWidth * 0.1,
                            width: deviceWidth * 0.1,
                            alignItems: 'center',
                            backgroundColor: '#fff',

                            borderRadius: deviceWidth * 0.1,
                        }}

                    >
                        <Text style={{
                            fontSize: FontSize.large,
                            color: Colors.fontColor
                        }}
                        >
                            x
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    )
}

export default TemppageScreen 