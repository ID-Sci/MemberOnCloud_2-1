

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
import { styles } from '../styles/styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontSize } from '../styles/FontSizeHelper';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default FlatListPromotion = ({ route }) => {
    const navigation = useNavigation();
    return (route &&
        (
            <View
            >
                 <View style={styles.menu_background}>
                    <Text style={styles.menu_text_title}>
                        กิจกรรม/ประชาสัมพันธ์
                    </Text>
                    <TouchableOpacity
                     style={styles.menu_btn}
                        onPress={() => navigation.navigate('ShowTemppage', { name: 'กิจกรรม/ประชาสัมพันธ์', route: route })}
                    >
                        <Text style={styles.menu_text_title}>
                            ดูเพิ่มเติม {`>>`}
                        </Text>
                    </TouchableOpacity>

                </View>
                <ScrollView
                    paddingBottom={deviceWidth * 0.05}
                    horizontal={true}
                    height={deviceHeight*0.4}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    {route.map((item, index) => {
                        return (index < 10 &&
                            <>
                                <View style={{ paddingLeft: deviceWidth * 0.01, paddingRight: deviceWidth * 0.01 }}>
                                    <TouchableOpacity style={ {marginBottom: deviceHeight *0.2}}
                                        onPress={() => navigation.navigate('Temppage', { name: 'กิจกรรม/ประชาสัมพันธ์', route: item })}>

                                        <Image
                                            style={ styles.menu_activity_image}
                                            source={{ uri: `data:image/png;base64,${item.IMAGE64}` }}
                                        />
                                        {/* <View style={{ padding: 10 }}>
                                            <Text>
                                                {item.SHWPH_EXPLAIN}
                                            </Text>
                                        </View> */}
                                    </TouchableOpacity>
                                </View>

                            </>
                        )
                    })}

                </ScrollView>
            </View>)
    )
}

