import {
  StyleSheet,
  Dimensions,
} from 'react-native'
import Colors from './colors';
import { FontSize } from './FontSizeHelper';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const overlayColor = "rgba(0,0,0,0.5)"; // this gives us a black color with a 50% transparency

const rectDimensions = deviceWidth * 0.65; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = deviceWidth * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = "red";

const scanBarWidth = deviceWidth * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = deviceWidth * 0.0025; //this is equivalent to 1 from a 393 device width
const scanBarColor = "#22ff00";

const iconScanColor = "blue";
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
  input_GOODS_CODE_Light_title: {
    flex: 8,
    borderBottomColor: Colors.borderColor,
    color: Colors.fontColor,
    fontFamily: 'Kanit-Light',
    fontSize: FontSize.medium,
  },
  inputtextLight_title:  {
    flex: 8,
    marginLeft: 10,
    borderBottomColor: Colors.borderColor,
    color: Colors.fontColor,
    paddingVertical: 7,
    fontFamily: 'Kanit-Light',
    fontSize: FontSize.medium,
    borderBottomWidth: 0.7,
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
  textLight: {
    color: Colors.fontColor,
    fontFamily: 'Kanit-Light'
  },
  textLink:{
    color: '#0288D1',
    fontFamily: 'Kanit-Light',
    textDecorationLine: 'underline',
    fontSize: FontSize.medium,
},
  textBold: {
    color: Colors.fontColor,
    fontFamily: 'Kanit-Bold'
  },
  textLight_red: {
    color: 'red',
    fontFamily: 'Kanit-Light'
  },
text_btn:{
  fontFamily: 'Kanit-Bold',
  fontSize: FontSize.large,
  color: Colors.buttonTextColor
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

    fontFamily: 'Kanit-Bold',
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
  },
  rectangleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },

  rectangle: {
    height: rectDimensions,
    width: rectDimensions,
    borderWidth: rectBorderWidth,
    borderColor: rectBorderColor,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },

  topOverlay: {
    flex: 1,
    height: deviceWidth,
    width: deviceWidth,
    backgroundColor: overlayColor,
    justifyContent: "center",
    alignItems: "center"
  },

  bottomOverlay: {
    flex: 1,
    height: deviceWidth,
    width: deviceWidth,
    backgroundColor: overlayColor,
    paddingBottom: deviceWidth * 0.25
  },

  leftAndRightOverlay: {
    height: deviceWidth * 0.65,
    width: deviceWidth,
    backgroundColor: overlayColor
  },

  scanBar: {
    width: scanBarWidth,
    height: scanBarHeight,
    backgroundColor: scanBarColor
  },



  centerText: {

    fontFamily: 'Kanit-Bold',
    flex: 1,
    fontSize: FontSize.medium,
    padding: 32,
    color: '#777',
  },
  textBold: {

    fontFamily: 'Kanit-Bold',
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {

    fontFamily: 'Kanit-Bold',
    fontSize: FontSize.medium,
    color: 'black',

  },
  buttonTouchable1: {
    alignSelf: 'flex-start',
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 5,
    //padding: 16,
  },
  buttonTouchable2: {
    alignSelf: 'flex-end',
    marginVertical: 10,
    marginHorizontal: 5,

    //flex:1
    //padding: 16,
  },
  back_btn: {
    padding: deviceWidth * 0.025,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  back_btn_view: {
    height: deviceWidth * 0.1,
    width: deviceWidth * 0.1,
    alignItems: 'center',
    backgroundColor: '#fff',

    borderRadius: deviceWidth * 0.1,
  },
  back_text_title: {
    color: Colors.lightPrimiryColor,
    fontSize: FontSize.large,
    fontFamily: 'Kanit-Bold',
    textAlign: 'center'
  },
  order: {
    width: deviceWidth,
    height: deviceHeight * 0.1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: Colors.backgroundColor,
  },
  order_btn: {
    padding: deviceWidth * 0.025,
    alignItems: 'center',
    justifyContent: 'center'
  },
  order_view: {

    width: deviceWidth * 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.menuButton,
    height: deviceHeight * 0.07,
    borderRadius: 10,
  },
  order_text: {
    fontFamily: 'Kanit-Light',
    fontSize: FontSize.medium,
    color: Colors.buttonTextColor
  },
  basket_img: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    resizeMode: 'contain',
    height: deviceHeight * 0.12,
    width: deviceWidth * 0.18,
  },
  basket_bg_btn: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center', flexDirection: 'row',
    height: deviceWidth * 0.33,
    width: deviceWidth * 0.9,
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
  basket_img_view:{
    width: deviceWidth*0.2,
    height: deviceHeight * 0.2,
    alignSelf: 'center',
    alignItems: 'center', 
    justifyContent:'center'
  },
  basket_obj_view:{  width: deviceWidth*0.7,
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: 'space-between',}
});