import { Alert } from "react-native";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type authState = {
   projList: Object
}

const initialState: authState = {
   projList: {}
}

export const projSlice = createSlice({
   name: "proj",
   initialState,
   reducers: {
      updateProjList: (state: authState, action: PayloadAction<any>) => {
         state.projList =action.payload;
      },
      clearProjList: (state: authState) => {
         state.projList = {};
      },
   },
})

export const { updateProjList, clearProjList } = projSlice.actions;
export const projSelector = (store: RootState) => store.projReducer;
export default projSlice.reducer;