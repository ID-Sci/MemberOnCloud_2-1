

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
import { Language, changeLanguage } from '../translations/I18n';
import { BorderlessButton } from 'react-native-gesture-handler';
import RNRestart from 'react-native-restart';
import * as Keychain from 'react-native-keychain'; 
import { styles,statusBarHeight, deviceWidth,deviceHeight} from '../styles/styles';

const TemppageScreen = () => {
    const navigation = useNavigation()

    const [Lang, setLang] = useState(Language.getLang)
    const [LangObj, setLangObj] = useState([{
        key: 1,
        name: 'ไทย',
        value: 'th'
    }, {
        key: 2,
        name: 'eng',
        value: 'en'
    }])
    console.log(`Lang >> ${Lang}`)
 

    const setAppLanguage = async () => {
        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = checkLoginToken ? JSON.parse(checkLoginToken.password) : null
        configToken.Language = Lang
        console.log(JSON.stringify(configToken))
        await changeLanguage(Lang)
        await Keychain.setGenericPassword("config", JSON.stringify(configToken))
        await RNRestart.restart()
    }
    return (
        <View
            style={{
                width: deviceWidth,
                height: deviceHeight
            }}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.header_text_Xtitle}>
                        {`<`}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => Alert.alert(Language.t('notiAlert.header'), Language.t('alert.changeLanguage'), [{
                        text: Language.t('alert.confirm'), onPress: () => setAppLanguage()
                    }, { text: Language.t('alert.cancel'), onPress: () => console.log(`onPress no`) }])}
                >
                    <Text style={styles.header_text_title}>
                        {Language.t('alert.confirm')}
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >


                <View style={{
                    backgroundColor: '#fff',
                    alignSelf: 'center',
                    padding: 10,
                    width: deviceWidth,
                }}
                >
                    {LangObj.map((item) => {
                        return (
                            <TouchableOpacity
                                onPress={() => setLang(item.value)}
                                style={{
                                    backgroundColor: '#fff', alignSelf: 'center',
                                    justifyContent: 'space-between', flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    width: deviceWidth * 0.9,
                                    height: 40,
                                    padding: 5
                                }} >
                                <Text style={styles.textLight}>
                                    {item.name}
                                </Text>
                                {item.value == Lang && (
                                    <Image
                                        style={{
                                            width: 30,
                                            height: 30,
                                            resizeMode: 'contain',
                                        }}

                                        source={require('../img/iconsMenu/check.png')}
                                    />
                                )}
                            </TouchableOpacity>
                        )
                    })}


                </View>



            </ScrollView>

        </View>

    )
}

export default TemppageScreen 