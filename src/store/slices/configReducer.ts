import { Alert } from "react-native";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios, { AxiosResponse, AxiosError } from 'axios';
type authState = {
   UserList: Object,
   LoginList: Object,
   MB_LOGIN_GUID:String
}

const initialState: authState = {
   UserList: {},
   LoginList: {},
   MB_LOGIN_GUID:''
}

export const configReducer = createSlice({
   name: "Config",
   initialState,
   reducers: {
      updateMB_LOGIN_GUID: (state: authState, action: PayloadAction<any>) => {
         state.MB_LOGIN_GUID = action.payload;
      },
      updateUserList: (state: authState, action: PayloadAction<any>) => {
         state.UserList = action.payload;
      },
      clearUserList: (state: authState) => {
         state.UserList = {};
      },
      updateLoginList: (state: authState, action: PayloadAction<any>) => {
         state.LoginList = action.payload;
      },
      clearLoginList: (state: authState) => {
         state.LoginList = {};
      },
   },
})


 

 
 

export const { updateUserList, clearUserList ,updateLoginList, clearLoginList,updateMB_LOGIN_GUID} = configReducer.actions;
export const config = (store: RootState) => store.configReducer;
export default configReducer.reducer;