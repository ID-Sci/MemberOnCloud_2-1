import { Alert } from "react-native";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type authState = {
   promotionList: Object
   promotionPage:Array<[]>
}

const initialState: authState = {
   promotionList: {},
   promotionPage:[]
}

export const promotionSlice = createSlice({
   name: "promotion",
   initialState,
   reducers: {
      updatePromotionList: (state: authState, action: PayloadAction<any>) => {
         state.promotionList =action.payload;
      },
      clearPromotionList: (state: authState) => {
         state.promotionList = {};
      },
      updatePromotionPage: (state: authState, action: PayloadAction<any>) => {
         state.promotionPage = action.payload;
      },
      clearPromotionPage: (state: authState) => {
         state.promotionPage = [];
      },
   },
})

export const { updatePromotionList, clearPromotionList,updatePromotionPage,clearPromotionPage } = promotionSlice.actions;
export const promotionSelector = (store: RootState) => store.promotionReducer;
export default promotionSlice.reducer;