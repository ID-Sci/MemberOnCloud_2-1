import {
  StyleSheet,
  Dimensions,
} from 'react-native'
import Colors from './colors';
import { FontSize } from './FontSizeHelper';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  center: {
    flex: 1,
    margin: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: FontSize.large,
    height: FontSize.large,
    resizeMode: 'contain',
  },
  iconmainObj: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    height: deviceWidth * 0.5,
    width: deviceWidth * 0.5,
    resizeMode: 'contain',
  },
  obj_list: {
    alignItems: 'center',
    paddingLeft: deviceWidth * 0.05,
    paddingRight: deviceWidth * 0.05,
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  obj_Noimage: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    height: deviceWidth * 0.2,
    width: deviceWidth * 0.3,
    resizeMode: 'contain',
  },
  obj_image: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    height: deviceHeight * 0.2,
    width: deviceWidth * 0.3,
    resizeMode: 'contain',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: deviceWidth,
    paddingLeft: FontSize.large,
    paddingRight: FontSize.large,
    height: FontSize.large * 2,
    backgroundColor: Colors.backgroundheader,
    borderBottomWidth: 1,
    borderColor: Colors.borderColor
  },
  activityIndicator: {
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 100,
    width: 100,
    borderRadius: deviceWidth * 0.05
  },
  header_text_title: {
    color: Colors.lightPrimiryColor,
    fontFamily: 'Kanit-Bold',
    textAlign: 'center'
  },
  inputtextLight_title: {
    flex: 8,
    borderBottomColor: Colors.borderColor,
    color: Colors.fontColor,
    fontFamily: 'Kanit-Light',
    fontSize: FontSize.medium,
  },
  textLight_title: {
    color: Colors.fontColor,
    fontFamily: 'Kanit-Light',
    textAlign: 'center'
  },
  textLight_titlered: {
    color: 'red',
    fontFamily: 'Kanit-Light',
    textAlign: 'center'
  },

  dropdownBtnStyle: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdownBtnTxtStyle: { color: '#444', textAlign: 'left' },
  dropdownDropdownStyle: { backgroundColor: '#EFEFEF' },
  dropdownRowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' },
  dropdownRowTxtStyle: { color: '#444', textAlign: 'left' },
  category_bottom_shadow: {
    backgroundColor: Colors.itemColor, alignSelf: 'center', padding: deviceWidth * 0.03,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center', borderRadius: deviceWidth * 0.05, flexDirection: 'row'
  },
  category_dropdownlist: {
    borderWidth: 0.5,
    borderColor: Colors.borderColor,
    width: deviceWidth,
    height: FontSize.large * 2,
    backgroundColor: '#fff', alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  category_bottom_text: {
    fontFamily: 'Kanit-Bold',
    textAlign: 'center'
  },
  category_bottom_text_title: {
    fontFamily: 'Kanit-Light',
    textAlign: 'center'
  },
  category_image_title: {
    height: deviceWidth * 0.1,
    width: deviceWidth * 0.1,
    resizeMode: 'contain',
  },
  menu_background: {
    backgroundColor: Colors.lightPrimiryColor,
    height: deviceWidth * 0.1,
    width: deviceWidth * 0.95,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: deviceWidth * 0.02,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menu_text_title: {
    color: Colors.buttonTextColor,
    fontFamily: 'Kanit-Bold',
    textAlign: 'center'
  },
  menu_btn: {
    backgroundColor: Colors.primaryColor,
    paddingLeft: FontSize.medium,
    paddingRight: FontSize.medium,
    height: FontSize.large,
    borderRadius: FontSize.large,
    alignSelf: 'center',
    alignItems: 'center',
  },
  promotin_btn: {
    backgroundColor: '#fff', alignSelf: 'center',
    justifyContent: 'center', flexDirection: 'row',
    height: deviceHeight * 0.2,
    width: deviceWidth * 0.8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: deviceWidth * 0.05,
    resizeMode: 'contain',
  },
  androidButtonText: {
    color: 'red',
    fontSize: 20
  },
  product_bottom_shadow: {
    backgroundColor: '#fff', alignItems: 'center',
    justifyContent: 'center',
    height: deviceWidth * 0.7,
    width: deviceWidth * 0.42,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    borderRadius: deviceWidth * 0.05,
  },
  newproduct_bottom_shadow: {
    backgroundColor: '#fff', alignItems: 'center',
    justifyContent: 'center',
    height: deviceWidth * 0.7,
    width: deviceWidth * 0.5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    borderRadius: deviceWidth * 0.05,
  },
  product_Noimage: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    height: deviceWidth * 0.2,
    width: deviceWidth * 0.3,
    resizeMode: 'contain',
  },
  product_image: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    height: deviceWidth * 0.35,
    width: deviceWidth * 0.45,
    resizeMode: 'contain',
  },
  product_bottom_text: {
    fontFamily: 'Kanit-Bold',
    textAlign: 'center'
  },
  product_bottom_text_title: {
    fontFamily: 'Kanit-Light',
    textAlign: 'center'
  },
  menu_activity_image: {
    backgroundColor: '#fff', alignItems: 'center',
    justifyContent: 'center',
    borderRadius: deviceWidth * 0.05,
    height: deviceHeight * 0.3,
    width: deviceWidth * 0.8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});