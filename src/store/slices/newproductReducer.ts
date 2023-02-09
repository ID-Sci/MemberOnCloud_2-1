import { Alert } from "react-native";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type authState = {
   newproductList: Object
   newproductPage:Array<[]>
   newproductContent:Array<[]>
}

const initialState: authState = {
   newproductList: {},
   newproductPage:[],
   newproductContent:[]
}

export const newproductSlice = createSlice({
   name: "newproduct",
   initialState,
   reducers: {
      updateNewproductList: (state: authState, action: PayloadAction<any>) => {
         state.newproductList =action.payload;
      },
      clearnewproductList: (state: authState) => {
         state.newproductList = {};
      },
      updateNewproductPage: (state: authState, action: PayloadAction<any>) => {
         state.newproductPage = action.payload;
      },
      clearNewproductPage: (state: authState) => {
         state.newproductPage = [];
      },
      updateNewproductContent: (state: authState, action: PayloadAction<any>) => {
         state.newproductContent = action.payload;
      },
      clearNewproductContent: (state: authState) => {
         state.newproductContent = [];
      },
   },
})

export const { updateNewproductList, clearnewproductList,updateNewproductPage,clearNewproductPage,updateNewproductContent,clearNewproductContent } = newproductSlice.actions;
export const newproductSelector = (store: RootState) => store.newproductReducer;
export default newproductSlice.reducer;