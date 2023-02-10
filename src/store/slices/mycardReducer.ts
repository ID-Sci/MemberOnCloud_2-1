import { Alert } from "react-native";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type authState = {
   mycardList: Object
   mycardPage:Array<[]>
}

const initialState: authState = {
   mycardList: {},
   mycardPage:[]
}

export const mycardSlice = createSlice({
   name: "mycard",
   initialState,
   reducers: {
      updateMycardList: (state: authState, action: PayloadAction<any>) => {
         state.mycardList =action.payload;
      },
      clearMycardList: (state: authState) => {
         state.mycardList = {};
      },
      updateMycardPage: (state: authState, action: PayloadAction<any>) => {
         state.mycardPage = action.payload;
      },
      clearMycardPage: (state: authState) => {
         state.mycardPage = [];
      },
   },
})

export const { updateMycardList, clearMycardList,updateMycardPage,clearMycardPage } = mycardSlice.actions;
export const mycardSelector = (store: RootState) => store.mycardReducer;
export default mycardSlice.reducer;