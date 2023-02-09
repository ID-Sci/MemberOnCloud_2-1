import { Alert } from "react-native";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type authState = {
   activityList: Object
   activityPage:Array<[]>
}

const initialState: authState = {
   activityList: {},
   activityPage:[]
}

export const activitySlice = createSlice({
   name: "activity",
   initialState,
   reducers: {
      updateActivityList: (state: authState, action: PayloadAction<any>) => {
         state.activityList =action.payload;
      },
      clearActivityList: (state: authState) => {
         state.activityList = {};
      },
      updateActivityPage: (state: authState, action: PayloadAction<any>) => {
         state.activityPage = action.payload;
      },
      clearActivityPage: (state: authState) => {
         state.activityPage = [];
      },
   },
})

export const { updateActivityList, clearActivityList,updateActivityPage,clearActivityPage } = activitySlice.actions;
export const activitySelector = (store: RootState) => store.activityReducer;
export default activitySlice.reducer;