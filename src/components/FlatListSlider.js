import React, { useEffect,useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Platform,
    Dimensions,
} from 'react-native';
import { FlatListSlider } from 'react-native-flatlist-slider';
import { useNavigation } from '@react-navigation/native';
import { styles,statusBarHeight, deviceWidth,deviceHeight} from '../styles/styles';
const images = []

export default FlatSlider = ({ route }) => {
    const [routeItem,setRouteItem] = useState(route)
    useEffect(()=>{
        setRouteItem(route)
    },[route])
    const navigation = useNavigation();
    return (route ?

        <FlatListSlider
            data={routeItem}
            height={(deviceWidth) / (5 / 3)}
            timer={5000}
            onPress={(item) => navigation.navigate('Temppage', { name: 'banner', route: route[item] })}
            contentContainerStyle={{ paddingHorizontal: 0 }}
            indicatorContainerStyle={{ position: 'absolute', bottom: 20 }}
            indicatorActiveColor={'#0077c2'}
            indicatorInActiveColor={'#ffffff'}
            animation
        />

        // indicatorActiveWidth={30}
        : <></>)
}