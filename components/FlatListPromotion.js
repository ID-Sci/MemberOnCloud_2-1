

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


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default FlatListPromotion = ({ route }) => {

    return (route &&
        (
            <View
            >
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingLeft: deviceWidth * 0.05,
                    paddingRight: deviceWidth * 0.05,
                    paddingBottom: deviceWidth * 0.05
                }}>
                    <Text
                        style={{
                            fontSize: FontSize.medium,
                            color: Colors.menuButton,
                            fontWeight: 'bold',
                        }}>
                        โปรโมชั่นแนะนำ
                    </Text>
                    <TouchableOpacity
                     onPress={() => console.log(route[0])}
                    >
                    <Text style={{
                        fontSize: FontSize.medium,
                    }}
                    >
                        ดูเพิ่มเติม {`>>`}
                    </Text>
                    </TouchableOpacity>
                 
                </View>
                <ScrollView
                    paddingBottom={deviceWidth * 0.05}
                    horizontal={true}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    {route.map((item) => {
                        return (
                            <>
                                <View style={{ paddingLeft: deviceWidth * 0.01, paddingRight: deviceWidth * 0.01 }}>
                                    <TouchableOpacity style={{
                                        backgroundColor: '#fff', alignSelf: 'center',
                                        justifyContent: 'center', flexDirection: 'row',
                                        height: deviceHeight * 0.2,
                                        width: deviceWidth * 0.8,
                                        borderRadius: deviceWidth * 0.05,
                                    }}
                                        onPress={() => console.log(item.SHWPH_TTL_ECPTN)}>
                                        <Image
                                            style={{
                                                shadowColor: '#000',
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.8,
                                                shadowRadius: 2,
                                                height: deviceHeight * 0.2,
                                                width: deviceWidth * 0.8,
                                                borderRadius: deviceWidth * 0.05,
                                            }}
                                            source={{ uri: `data:image/png;base64,${item.IMAGE64}` }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </>
                        )
                    })}

                </ScrollView>
            </View>)
    )
}

