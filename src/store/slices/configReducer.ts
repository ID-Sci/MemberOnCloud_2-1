import { Alert } from "react-native";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios, { AxiosResponse, AxiosError } from 'axios';
type authState = {
   UserList: Object,
   LoginList: LoginListType,
   MB_LOGIN_GUID: String,
   AR_CODE: String,
   Oe:any
}

type LoginListType = {
   BPAPUS_GUID: string,  
}

const testObject = {
   BPAPUS_GUID: ""
}

const initialState: authState = {
   UserList: {},
   LoginList: testObject,
   MB_LOGIN_GUID: '',
   AR_CODE: '',
   Oe:[]
}


export const configReducer = createSlice({
   name: "Config",
   initialState,
   reducers: {
      updateARcode: (state: authState, action: PayloadAction<any>) => {
         state.AR_CODE = action.payload;
      },
      updateMB_LOGIN_GUID: (state: authState, action: PayloadAction<any>) => {
         state.MB_LOGIN_GUID = action.payload;
      },
      updateUserList: (state: authState, action: PayloadAction<any>) => {
         state.UserList = action.payload;
      },
      updateUserOe: (state: authState, action: PayloadAction<any>) => {
         state.Oe = action.payload;
      },
      clearUserList: (state: authState) => {
         state.UserList = {};
      },
      updateLoginList: (state: authState, action: PayloadAction<any>) => {
         state.LoginList = action.payload;
      },
      clearLoginList: (state: authState) => {
         state.LoginList = { BPAPUS_GUID: ""};
      },
   },
})

export const { updateUserList, clearUserList,updateUserOe, updateLoginList, clearLoginList, updateMB_LOGIN_GUID, updateARcode } = configReducer.actions;
export const config = (store: RootState) => store.configReducer;
export default configReducer.reducer;