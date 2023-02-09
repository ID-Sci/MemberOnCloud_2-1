import { Alert } from "react-native";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios, { AxiosResponse, AxiosError } from 'axios';
type authState = {
   ConfigList: Object,
   LoginList: Object
}

const initialState: authState = {
   ConfigList: {},
   LoginList: {}
}

export const configReducer = createSlice({
   name: "Config",
   initialState,
   reducers: {
      updateConfigList: (state: authState, action: PayloadAction<any>) => {
         state.ConfigList = action.payload;
      },
      clearConfigList: (state: authState) => {
         state.ConfigList = {};
      },
      updateLoginList: (state: authState, action: PayloadAction<any>) => {
         state.LoginList = action.payload;
      },
      clearLoginList: (state: authState) => {
         state.LoginList = {};
      },
   },
})


 

 
 

export const { updateConfigList, clearConfigList ,updateLoginList, clearLoginList} = configReducer.actions;
export const config = (store: RootState) => store.configReducer;
export default configReducer.reducer;