import { Alert } from "react-native";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type authState = {
   docinfoList: Object
   docinfoPage:Array<[]>
}

const initialState: authState = {
   docinfoList: {},
   docinfoPage:[]
}

export const docinfoSlice = createSlice({
   name: "docinfo",
   initialState,
   reducers: {
      updateDocinfoList: (state: authState, action: PayloadAction<any>) => {
         state.docinfoList =action.payload;
      },
      clearDocinfoList: (state: authState) => {
         state.docinfoList = {};
      },
      updateDocinfoPage: (state: authState, action: PayloadAction<any>) => {
         state.docinfoPage = action.payload;
      },
      clearDocinfoPage: (state: authState) => {
         state.docinfoPage = [];
      },
   },
})

export const { updateDocinfoList, clearDocinfoList,updateDocinfoPage,clearDocinfoPage } = docinfoSlice.actions;
export const docinfoSelector = (store: RootState) => store.docinfoReducer;
export default docinfoSlice.reducer;