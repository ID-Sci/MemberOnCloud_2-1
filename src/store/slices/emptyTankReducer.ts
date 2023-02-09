import { Alert } from "react-native";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type authState = {
   emptyTankList: Array<[]>
}

const initialState: authState = {
   emptyTankList: []
}

export const emptyTankSlice = createSlice({
   name: "emptyTank",
   initialState,
   reducers: {
      updateEmptyTankList: (state: authState, action: PayloadAction<any>) => {
         state.emptyTankList =action.payload;
      },
      clearEmptyTankList: (state: authState) => {
         state.emptyTankList = [];
      },
   },
})

export const { updateEmptyTankList, clearEmptyTankList } = emptyTankSlice.actions;
export const emptyTankSelector = (store: RootState) => store.emptyTankReducer;
export default emptyTankSlice.reducer;