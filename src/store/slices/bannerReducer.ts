import { Alert } from "react-native";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type authState = {
   bannerList: Object
   bannerPage:Array<[]>
}

const initialState: authState = {
   bannerList: {},
   bannerPage:[]
}

export const bannerSlice = createSlice({
   name: "banner",
   initialState,
   reducers: {
      updateBannerList: (state: authState, action: PayloadAction<any>) => {
         state.bannerList =action.payload;
      },
      clearBannerList: (state: authState) => {
         state.bannerList = {};
      },
      updateBannerPage: (state: authState, action: PayloadAction<any>) => {
         const newBanner =
         action.payload &&
         action.payload.map((object:any) => {
           object['image'] = `data:image/png;base64,${object.IMAGE64}`
           return object
         })
         state.bannerPage = newBanner;
      },
      clearBannerPage: (state: authState) => {
         state.bannerPage = [];
      },
   },
})

export const { updateBannerList, clearBannerList,updateBannerPage,clearBannerPage } = bannerSlice.actions;
export const bannerSelector = (store: RootState) => store.bannerReducer;
export default bannerSlice.reducer;