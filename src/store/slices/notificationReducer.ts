import { Alert } from "react-native";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type authState = {
   notificationList: Object
   notificationPage:Array<[]>
}

const initialState: authState = {
   notificationList: {},
   notificationPage:[]
}

export const notificationSlice = createSlice({
   name: "promotion",
   initialState,
   reducers: {
      updateNotificationList: (state: authState, action: PayloadAction<any>) => {
         state.notificationList =action.payload;
      },
      clearNotificationList: (state: authState) => {
         state.notificationList = {};
      },
      updateNotificationPage: (state: authState, action: PayloadAction<any>) => {
         state.notificationPage = action.payload;
      },
      clearNotificationPage: (state: authState) => {
         state.notificationPage = [];
      },
   },
})

export const { updateNotificationList, clearNotificationList,updateNotificationPage,clearNotificationPage } = notificationSlice.actions;
export const notificationSelector = (store: RootState) => store.notificationReducer;
export default notificationSlice.reducer;