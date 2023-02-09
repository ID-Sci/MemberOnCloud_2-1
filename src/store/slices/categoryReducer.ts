import { Alert } from "react-native";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type authState = {
   categoryList: Object,
   categoryPage: Array<{ id: number, data: string }>
}

const initialState: authState = {
   categoryList: {},
   categoryPage:[]
}

export const categorySlice = createSlice({
   name: "category",
   initialState,
   reducers: {
      updateCategoryList: (state: authState, action: PayloadAction<any>) => {
         state.categoryList =action.payload;
      },
      clearCategoryList: (state: authState) => {
         state.categoryList = {};
      },
      updateCategoryPage: (state: authState, action: PayloadAction<any>) => {
         state.categoryPage = action.payload;
      },
      clearCategoryPage: (state: authState) => {
         state.categoryPage = [];
      },
   },
})

export const { updateCategoryList, clearCategoryList,updateCategoryPage,clearCategoryPage } = categorySlice.actions;
export const categorySelector = (store: RootState) => store.categoryReducer;
export default categorySlice.reducer;