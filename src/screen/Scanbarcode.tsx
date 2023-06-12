import React, { useState, useEffect } from 'react';

import {
  StyleSheet, Platform, Dimensions, View, Text, Alert, TouchableOpacity,
  Image,
  ScrollView,
  TouchableNativeFeedback,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import * as  ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import { FontSize } from '../styles/FontSizeHelper';
import { styles } from '../styles/styles';
import * as Animatable from 'react-native-animatable';
import { QRreader } from 'react-native-qr-decode-image-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';



const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
export interface ScanBarcodeParams {
  route: keyof RootStackParamList,
  data: any
}
type OrderDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Scanbarcode'
>;
const Scanbarcode: React.FC<OrderDetailScreenProps> = ({ navigation, route }) => {
  let checkAndroidPermission = true
  var a = 0
  useEffect(() => {
    a = Math.floor(100000 + Math.random() * 900000);
    console.log(route.params, ' code: ', a)
  }, [])

  if (Platform.OS === 'android' && Platform.Version < 23) {
    checkAndroidPermission = false
  }
  const onSuccess = (e: any) => {


    if (e && e.data) {
      navigation.navigate(route.params.route, { route: route.params.data, post: e.data, data: a });
    }
  };

  const chooseFile = () => {
    let options: any = {
      title: 'เลือกรูปภาพ',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        console.log('response.didCancel');
      } else if (response.error) {
        console.log('response.error');
      } else {
        let path = null;
        if (Platform.OS == 'android') {
          path = response.assets[0].path;
          if (!path) {
            path = response.assets[0].uri;
          }
        } else {
          path = response.path;
          if (!path) {
            path = response.uri;
          }
        }

        QRreader(path)
          .then((data: any) => {
            if (data) {
              if (route.params?.GOODSMASTER) navigation.navigate(route.params.route, { route: route.params.data, post: data, data: a, GOODSMASTER: route.params.GOODSMASTER });
              else navigation.navigate(route.params.route, { route: route.params.data, post: data, data: a });
            }
          })
          .catch((error: any) => {
            console.log(error);
          });
      }
    });
  };


  return (
    <QRCodeScanner
      checkAndroid6Permissions={checkAndroidPermission}
      onRead={onSuccess}
      cameraType={'back'}
      fadeIn={true}
      reactivate={true}
      showMarker={true}
      customMarker={
        <View style={styles.rectangleContainer}>
          <View style={{ flexDirection: "row" }}>
            <View />
            <View style={styles.rectangle}>

              <Animatable.View
                style={styles.scanBar}
                direction="alternate-reverse"
                iterationCount="infinite"
                duration={1700}
                easing="linear"
              />
            </View>

            <View />
          </View>

          <View />
        </View>
      }
      topContent={

        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: 10,
            flex: 1,
          }}>

          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.buttonTouchable1}>
            <Image
              source={require('../img/iconsMenu/goback.png')}
              style={{
                width: FontSize.large * 1.5,
                height: FontSize.large * 1.5,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={chooseFile}
            style={styles.buttonTouchable2}>
            <Text style={styles.buttonText}>
              เลือกรูปภาพ
            </Text>
          </TouchableOpacity>
        </View>
      }
      topViewStyle={{

        alignItems: 'flex-start',
        flexDirection: 'row',
      }}

    />
  );
};




export default Scanbarcode 