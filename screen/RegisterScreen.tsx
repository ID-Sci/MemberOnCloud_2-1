

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
    KeyboardAvoidingView,

} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

import Colors from '../src/styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontSize } from '../src/styles/FontSizeHelper';
import { config, updateConfigList, clearConfigList, updateLoginList, clearLoginList } from '../src/store/slices/configReducer';
import CurrencyInput from 'react-native-currency-input';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useAppDispatch, useAppSelector } from '../src/store/store';

import moment from 'moment';
import * as Keychain from 'react-native-keychain';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const RegisterScreen = ({ route }: any) => {
    const [LoginState, setLoginState] = useState(true)
    const [Phone, setPhone] = useState('')
    const [I_CARD, setI_CARD] = useState('')
    const [PasswordParm, setPasswordParm] = useState('')
    const ConfigList = useAppSelector(config)
    const navigation = useNavigation()
    const setPhoneNum = (val: any) => {
        setPhone(val.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'))
        setNewData({
            ...newData,
            MB_REG_MOBILE: val.replace(/(\d{3})(\d{3})(\d{4})/, '$1$2$3')
        })

    }
    const set_I_CARD = (val: any) => {
        setI_CARD(val.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, '$1 $2 $3 $4 $5'))
        setNewData({
            ...newData,
            MB_I_CARD: val.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, '$1$2$3$4$5')
        })

    }

    const [newData, setNewData] = useState({
        MB_INTL: 'M',
        MB_NAME: '',
        MB_SURNME: '',
        MB_SEX: '',
        MB_BIRTH: moment().format('YYYYMMDD'),
        MB_ADDR_1: ' ',
        MB_POST: ' ',
        MB_I_CARD: '',
        MB_EMAIL: '',
        MB_CNTRY_CODE: '66',
        MB_REG_MOBILE: '',
        MB_PW: '',
        MB_CPW: ''
    });

    const getNewMemberMbUsers = async () => {

        const checkLoginToken = await Keychain.getGenericPassword();
        const configToken = JSON.parse(checkLoginToken.password)
        let sex = 'M'
        newData.MB_INTL == 'นาย' || newData.MB_INTL == 'คุณ' || newData.MB_INTL == 'ด.ช.' || newData.MB_INTL == 'MR.' ? sex = 'M' : sex = 'F'
        console.log(newData.MB_I_CARD)
        await fetch(configToken.WebService + '/MbUsers', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': configToken.ServiceID.ETransaction,
                'BPAPUS-LOGIN-GUID': ConfigList.LoginList.BPAPUS_GUID,
                'BPAPUS-FUNCTION': 'NewMember',
                'BPAPUS-PARAM':
                    '{"MB_INTL":  "' +
                    newData.MB_INTL +
                    '","MB_NAME":"' +
                    newData.MB_NAME +
                    '","MB_SURNME":"' +
                    newData.MB_SURNME +
                    '","MB_SEX": "' +
                    sex +
                    '","MB_BIRTH": "' +
                    newData.MB_BIRTH +
                    '","MB_ADDR_1": "' +
                    newData.MB_ADDR_1 +
                    '","MB_POST": "' +
                    newData.MB_POST +
                    '","MB_I_CARD": "' +
                    newData.MB_I_CARD +
                    '","MB_EMAIL": "' +
                    newData.MB_EMAIL +
                    '","MB_CNTRY_CODE":"' +
                    newData.MB_CNTRY_CODE +
                    '","MB_REG_MOBILE":"' +
                    newData.MB_REG_MOBILE +
                    '","MB_PW": "' +
                    newData.MB_PW + '"}',
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                console.log(json)
                if (json.ResponseCode == 200) {
                    Alert.alert(`สำเร็จ`, `${json.ReasonString}`, [
                        { text: `ยืนยัน`, onPress: () => console.log() }])
                } else {

                    Alert.alert(`แจ้งเตือน`, `${json.ReasonString}`, [
                        { text: `ยืนยัน`, onPress: () => console.log() }])
                }


            })
            .catch((error) => {

                Alert.alert(`แจ้งเตือน`, `${error}`, [
                    { text: `ยืนยัน`, onPress: () => console.log() }])
                console.log('ERROR ' + error);
            });
    };
    return (
        (
            <View
                style={{
                    width: deviceWidth,
                    height: deviceHeight
                }}
            >

                <View

                    style={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        width: deviceWidth,
                        padding: deviceHeight * 0.02,
                        backgroundColor: Colors.backgroundLoginColorSecondary,
                        borderBottomWidth: 1,
                        borderColor: Colors.borderColor
                    }}>
                    <Text
                        style={{
                            fontSize: FontSize.medium,
                            color: Colors.menuButton,
                            fontWeight: 'bold',
                        }}>
                        {route.params.name}
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={{
                            fontSize: FontSize.large,
                        }}
                        >
                            x
                        </Text>
                    </TouchableOpacity>
                </View>
                <ScrollView >

                    <View style={{ padding: deviceWidth * 0.05 }}>

                        <KeyboardAvoidingView behavior={'height'}>
                            <ScrollView   >
                                <Text style={styles.textTitle}>
                                    คำนำหน้า
                                </Text>
                                <View style={{
                                    backgroundColor: Colors.backgroundColorSecondary,

                                    borderRadius: 10,

                                    padding: 5,
                                    borderColor: 'gray',
                                    borderWidth: 0.7,
                                    flexDirection: 'row',
                                }}>

                                    <Picker
                                        style={{
                                            backgroundColor: Colors.backgroundColorSecondary,

                                            width: deviceWidth * 0.8,
                                        }}
                                        mode="dropdown"
                                        selectedValue={newData.MB_INTL}
                                        onValueChange={(item) => {
                                            setNewData({
                                                ...newData,
                                                MB_INTL: item,
                                            })
                                        }}
                                        itemStyle={{
                                            width: 50,
                                        }}>

                                        <Picker.Item label="นาย" value="นาย" />
                                        <Picker.Item label="คุณ" value="คุณ" />
                                        <Picker.Item label="ด.ช." value="ด.ช." />
                                        <Picker.Item label="ด.ญ." value="ด.ญ." />
                                        <Picker.Item label="นาง" value="นาง" />
                                        <Picker.Item label="น.ส." value="น.ส." />
                                        <Picker.Item label="MR." value="MR." />
                                        <Picker.Item label="MRS." value="MRS." />
                                        <Picker.Item label="Ms." value="Ms." />
                                    </Picker>
                                </View>

                                <View style={{
                                    marginTop: deviceWidth * 0.05
                                }}>
                                    <Text style={styles.textTitle}>
                                        ชื่อ
                                    </Text>
                                    <View style={{
                                        backgroundColor: Colors.backgroundColorSecondary,
                                        borderRadius: 10,
                                        paddingLeft: 20,
                                        paddingRight: 20,
                                        paddingTop: 10,
                                        height: 'auto',
                                        paddingBottom: 10,
                                        borderColor: 'gray',
                                        borderWidth: 0.7,
                                        flexDirection: 'row',
                                    }}>
                                        <TextInput
                                            placeholderTextColor={Colors.fontColorSecondary}
                                            value={newData.MB_NAME}
                                            onChangeText={(item: any) => setNewData({
                                                ...newData,
                                                MB_NAME: item,
                                            })}
                                            placeholder={`ชื่อ`}

                                            style={styles.textInput}></TextInput>
                                    </View>
                                </View>
                                <View style={{
                                    marginTop: deviceWidth * 0.05
                                }}>
                                    <Text style={styles.textTitle}>
                                        นามสกุล
                                    </Text>
                                    <View style={{
                                        backgroundColor: Colors.backgroundColorSecondary,
                                        borderRadius: 10,
                                        paddingLeft: 20,
                                        paddingRight: 20,
                                        paddingTop: 10,
                                        height: 'auto',
                                        paddingBottom: 10,
                                        borderColor: 'gray',
                                        borderWidth: 0.7,
                                        flexDirection: 'row',
                                    }}>
                                        <TextInput
                                            placeholderTextColor={Colors.fontColorSecondary}
                                            value={newData.MB_SURNME}
                                            onChangeText={(item: any) => setNewData({
                                                ...newData,
                                                MB_SURNME: item,
                                            })}
                                            placeholder={`นามสกุล`}

                                            style={styles.textInput}></TextInput>
                                    </View>
                                </View>
                                <View style={{
                                    marginTop: deviceWidth * 0.05
                                }}>
                                    <Text style={styles.textTitle}>
                                        เลขประจำตัวประชาชน
                                    </Text>
                                    <View style={{
                                        backgroundColor: Colors.backgroundColorSecondary,
                                        borderRadius: 10,
                                        paddingLeft: 20,
                                        paddingRight: 20,
                                        paddingTop: 10,
                                        height: 'auto',
                                        paddingBottom: 10,
                                        borderColor: 'gray',
                                        borderWidth: 0.7,
                                        flexDirection: 'row',
                                    }}>
                                        <TextInput
                                            placeholderTextColor={Colors.fontColorSecondary}
                                            value={I_CARD}
                                            onChangeText={(item: any) => set_I_CARD(item)}
                                            placeholder={`X XXX XXXXXX XX X`}
                                            maxLength={17}
                                            style={styles.textInput}></TextInput>
                                    </View>
                                </View>
                                <View style={{
                                    marginTop: deviceWidth * 0.05
                                }}>
                                    <Text style={styles.textTitle}>
                                        เบอร์โทร
                                    </Text>
                                    <View style={{
                                        backgroundColor: Colors.backgroundColorSecondary,
                                        borderRadius: 10,
                                        paddingLeft: 20,
                                        paddingRight: 20,
                                        paddingTop: 10,
                                        height: 'auto',
                                        paddingBottom: 10,
                                        borderColor: 'gray',
                                        borderWidth: 0.7,
                                        flexDirection: 'row',
                                    }}>
                                        <TextInput
                                            placeholderTextColor={Colors.fontColorSecondary}
                                            value={Phone}
                                            onChangeText={(item: any) => setPhoneNum(item)}
                                            keyboardType="number-pad"
                                            placeholder={'0XX-XXX-XXXX'}
                                            maxLength={12}
                                            style={styles.textInput}></TextInput>
                                    </View>
                                </View>
                                <View style={{
                                    marginTop: deviceWidth * 0.05
                                }}>
                                    <Text style={styles.textTitle}>
                                        อีเมล์
                                    </Text>
                                    <View style={{
                                        backgroundColor: Colors.backgroundColorSecondary,
                                        borderRadius: 10,
                                        paddingLeft: 20,
                                        paddingRight: 20,
                                        paddingTop: 10,
                                        height: 'auto',
                                        paddingBottom: 10,
                                        borderColor: 'gray',
                                        borderWidth: 0.7,
                                        flexDirection: 'row',
                                    }}>
                                        <TextInput
                                            placeholderTextColor={Colors.fontColorSecondary}
                                            value={newData.MB_EMAIL}
                                            onChangeText={(item: any) => setNewData({
                                                ...newData,
                                                MB_EMAIL: item,
                                            })}
                                            placeholder={`อีเมล์`}
                                            style={styles.textInput}></TextInput>
                                    </View>
                                </View>

                                <View style={{
                                    marginTop: deviceWidth * 0.05
                                }}>
                                    <Text style={styles.textTitle}>
                                        รหัสผ่าน
                                    </Text>
                                    <View style={{
                                        backgroundColor: Colors.backgroundColorSecondary,
                                        borderRadius: 10,
                                        paddingLeft: 20,
                                        paddingRight: 20,
                                        paddingTop: 10,
                                        height: 'auto',
                                        paddingBottom: 10,
                                        borderColor: newData.MB_PW == newData.MB_CPW ? 'gray' : 'red',
                                        borderWidth: 0.7,
                                        flexDirection: 'row',
                                    }}>
                                        <TextInput
                                            placeholderTextColor={Colors.fontColorSecondary}
                                            value={newData.MB_PW}
                                            onChangeText={(item: any) => setNewData({
                                                ...newData,
                                                MB_PW: item,
                                            })}

                                            placeholder={`รหัสผ่าน`}

                                            style={styles.textInput}></TextInput>
                                    </View>
                                </View>
                                <View style={{
                                    marginTop: deviceWidth * 0.05
                                }}>
                                    <Text style={styles.textTitle}>
                                        ยืนยันรหัสผ่าน
                                    </Text>
                                    <View style={{
                                        backgroundColor: Colors.backgroundColorSecondary,
                                        borderRadius: 10,
                                        paddingLeft: 20,
                                        paddingRight: 20,
                                        paddingTop: 10,
                                        height: 'auto',
                                        paddingBottom: 10,
                                        borderColor: newData.MB_PW == newData.MB_CPW ? 'gray' : 'red',
                                        borderWidth: 0.7,
                                        flexDirection: 'row',
                                    }}>
                                        <TextInput
                                            placeholderTextColor={Colors.fontColorSecondary}
                                            value={newData.MB_CPW}
                                            onChangeText={(item: any) => setNewData({
                                                ...newData,
                                                MB_CPW: item,
                                            })}

                                            placeholder={`ยืนยันรหัสผ่าน`}

                                            style={styles.textInput}></TextInput>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => getNewMemberMbUsers()}
                                    style={{
                                        marginTop: deviceHeight * 0.03,
                                        marginBottom: deviceHeight * 0.03,
                                        padding: deviceWidth * 0.025,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <View
                                        style={{

                                            width: deviceWidth * 0.9,
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
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </ScrollView>
            </View>
        )
    )
}

const styles = StyleSheet.create({
    container1: {

        paddingBottom: 0,
        flex: 1,
        flexDirection: 'column',

    },
    container2: {
        width: deviceWidth,
        height: '100%',
        position: 'absolute',
        backgroundColor: 'white',
        flex: 1,
    },
    button: {
        marginTop: 10,
        padding: 5,
        marginBottom: 20,
        alignItems: 'center',
        backgroundColor: Colors.buttonColorPrimary,
        borderRadius: 10,
    },
    textTitle: {
        fontSize: FontSize.medium,
        color: Colors.fontColor,
    },
    textTitle2: {
        alignSelf: 'center',
        fontSize: FontSize.medium,
        color: Colors.fontColor,
    },
    textButton: {
        color: Colors.fontColor2,
        fontSize: FontSize.medium,
        padding: 10,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    textInput: {
        flex: 8,


        color: Colors.fontColor,
        fontSize: FontSize.medium,
        height: 'auto',
        borderBottomWidth: 0.7,
    },
});

export default RegisterScreen 