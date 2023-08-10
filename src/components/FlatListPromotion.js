

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
import Colors from '../styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontSize } from '../styles/FontSizeHelper';
import { styles } from '../styles/styles';
import { Language, changeLanguage } from '../translations/I18n';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

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
                    height={deviceHeight * 0.25}
                    horizontal={true}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    {route.map((item, index) => {
                        return (index < 10 &&
                            <>
                                <View style={{ paddingLeft: deviceWidth * 0.01, paddingRight: deviceWidth * 0.01 }}>
                                    <TouchableOpacity  
                                        onPress={() => navigation.navigate('Temppage', { name: Language.t('promotion.header'), route: item })}>
                                        <Image
                                            style={styles.promotin_btn}
                                            source={{ uri: `data:image/png;base64,${item.IMAGE64}` }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </>
                        )
                    })}

                </ScrollView>
            </>)
    )
}

