

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
import FlatListPromotion from '../components/FlatListPromotion';
import { BorderlessButton } from 'react-native-gesture-handler'; 
import { Language } from '../translations/I18n';
import { styles,statusBarHeight, deviceWidth,deviceHeight} from '../styles/styles';

const TemppageScreen = ({ route }: any) => {
    const navigation = useNavigation()
    const [order, setOrder] = useState(1)
    const item = route.params.route

    return (route.params.route &&
        (
            <View style={{ alignItems: 'flex-end' }}>
                <View style={{
                    width: deviceWidth,
                    height: deviceHeight + statusBarHeight,
                    backgroundColor: '#fff',
                }}>
                    <Image
                        style={{
                            height: deviceWidth / (5 / 3),
                            width: (deviceWidth),

                        }}
                        source={{ uri: `data:image/png;base64,${item.IMAGE64}` }}
                    />
                    <ScrollView
                        style={{
                            width: deviceWidth,
                        }}>
                        < >


                            <View
                                style={{
                                    padding: deviceWidth * 0.1
                                }}>

                                <Text style={styles.textLight}>
                                    {item.SHWPH_EXPLAIN.split('EN:').length > 1 ? Language.getLang() == 'th' ? item.SHWPH_EXPLAIN.split('EN:')[0]
                                        : item.SHWPH_EXPLAIN.split('EN:')[1]
                                        : item.SHWPH_EXPLAIN.split('EN:')[0]}
                                </Text>

                            </View>
                        </ >
                    </ScrollView>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.back_btn}
                >
                    <View style={styles.back_btn_view}>
                        <Text style={styles.back_text_title}>
                            x
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    )
}

export default TemppageScreen 