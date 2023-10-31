

import React, { useState, useEffect } from 'react';

import {
    ActivityIndicator,
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
import Colors from '../styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontSize } from '../styles/FontSizeHelper';
import { styles, statusBarHeight, deviceWidth, deviceHeight } from '../styles/styles';
import { Language, changeLanguage } from '../translations/I18n';



export default FlatListPromotion = ({ route }) => {
    const navigation = useNavigation();
    return (route &&
        (
            <>
                <View style={styles.menu_background}>
                    <Text style={styles.menu_text_title}>
                        {Language.t('promotion.header')}
                    </Text>

                    <TouchableOpacity
                        style={styles.menu_btn}
                        onPress={() => navigation.navigate('ShowTemppage', { name: Language.t('promotion.header'), route: route })}
                    >
                        <Text style={styles.menu_text_title}>
                            {Language.t('promotion.seeMore')}
                        </Text>
                    </TouchableOpacity>

                </View>
                <ScrollView
                    horizontal={true}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{
                        paddingBottom: 10
                    }}
                >
                    {route.map((item, index) => {
                        return (index < 10 &&
                            <>
                                <View style={{ paddingRight: 10, paddingBottom: 10 }}>
                                    <TouchableOpacity
                                        style={styles.promotin_btn}
                                        onPress={() => navigation.navigate('Temppage', { name: Language.t('promotion.header'), route: item })}>

                                        {item.IMAGE64 === true ?
                                            <ActivityIndicator
                                                animating={true}
                                                size="large"
                                                color={Colors.lightPrimiryColor}
                                            /> : <Image
                                                style={styles.promotin_btn}
                                                source={{ uri: `data:image/png;base64,${item.IMAGE64}` }}
                                            />}

                                    </TouchableOpacity>
                                </View>
                            </>
                        )
                    })}

                </ScrollView>
            </>)
    )
}

