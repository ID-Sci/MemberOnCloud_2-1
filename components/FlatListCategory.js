

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

export default FlatListCategory = ({ route }) => {

    return (route &&
        (<ScrollView
            paddingTop={deviceWidth * 0.03}
            paddingBottom={deviceWidth * 0.03}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false} >
            {route.map((item) => {
                return (
                    <>
                        <View style={{ paddingRight: deviceWidth * 0.015, paddingLeft: deviceWidth * 0.015 }}>
                            <TouchableOpacity style={{
                                backgroundColor: '#fff', alignSelf: 'center', padding: deviceWidth * 0.03,
                                justifyContent: 'center', borderRadius: deviceWidth * 0.1, flexDirection: 'row', backgroundColor: Colors.borderColor
                            }}
                                onPress={() => console.log(item.SHWPH_TTL_ECPTN)}>
                                <Image
                                    style={{
                                        height: deviceWidth * 0.1,
                                        width: deviceWidth * 0.1,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowRadius: 2,
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

