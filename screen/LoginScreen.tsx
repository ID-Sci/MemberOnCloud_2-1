

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
import { BorderlessButton } from 'react-native-gesture-handler';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const LoginScreen = ({ route }: any) => {
    const [LoginState, setLoginState] = useState(true)
    const [Phone, setPhone] = useState('')
    const [PhoneLength, setPhoneLength] = useState(0)
    const navigation = useNavigation();
    const setPhoneNum = (val: any) => {
        setPhone(val.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'))
    }
    return (
        (
            <ScrollView>
                <View style={{
                    backgroundColor: Colors.backgroundColor,
                    padding: deviceWidth * 0.1
                }} >

                    <View>
                        <Image
                            style={{
                                width: undefined,
                                height: deviceWidth / 1.5,
                            }}
                            resizeMode={'contain'}
                            source={require('../img/LogoBplusMember.png')}
                        />
                    </View>
                    <View
                        style={{
                            backgroundColor: Colors.backgroundLoginColorSecondary,

                            flexDirection: 'column',
                            borderRadius: 20,
                            padding: 20,
                        }}>
                        <View>
                            <Text style={{ alignSelf: 'center' }}>
                                ลงทะเบียนรับโปรดีๆ มากมาย
                            </Text>
                        </View>
                        <View style={{ height: 40, flexDirection: 'row' }}>
                            <TextInput
                                style={{
                                    flex: 8,
                                    marginLeft: 10,
                                    borderBottomColor: Colors.borderColor,
                                    color: Colors.fontColor,
                                    paddingVertical: 7,
                                    fontSize: FontSize.medium,
                                    borderBottomWidth: 0.7,
                                }}
                                value={Phone}
                                onChangeText={(val) => {
                                    setPhoneNum(val);
                                }}
                                keyboardType="number-pad"
                                placeholder={'0XX-XXX-XXXX'}
                                placeholderTextColor={Colors.fontColorSecondary}
                                maxLength={12}
                            ></TextInput>
                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{

                                padding: deviceWidth * 0.025,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <View
                                style={{

                                    width: deviceWidth * 0.7,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    backgroundColor: Colors.menuButton,
                                    height: deviceHeight * 0.07,
                                    borderRadius: deviceWidth * 0.1,
                                }}

                            >
                                <Text style={{
                                    fontSize: FontSize.large,
                                    color: Colors.buttonTextColor
                                }}
                                >

                                    {`ลงทะเบียน`}


                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                        >
                            <Text style={{ alignSelf: 'center', borderBottomWidth: 1, paddingBottom: 1 }}>
                                สมัครสมาชิก
                            </Text>
                        </TouchableOpacity>


                    </View>


                </View>

            </ScrollView>
        )
    )
}

export default LoginScreen 