import { Alert } from "react-native";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type authState = {
   basketProduct: Array<[]>
   basketProductERP: Array<[]>
   item: Array<[]>
   prepareDocument: Object
}

const initialState: authState = {
   basketProduct: [],
   basketProductERP: [],
   item: [],
   prepareDocument: {},
}

export const basketSlice = createSlice({
   name: "basket",
   initialState,
   reducers: {
      itemBasket: (state: authState, action: PayloadAction<any>) => {
         state.item = action.payload;
      },
      updatePrepareDocumentt: (state: authState, action: PayloadAction<any>) => {
         state.prepareDocument = action.payload;
      },
      updateBasket: (state: authState, action: PayloadAction<any>) => {
         state.basketProduct = action.payload;
         const newData = action.payload.map((object: any) => {
            return {
               KEY: object.KEY,
               TRD_KEYIN: object.GOODS_CODE,
               TRD_QTY: object.QTY,
               TRD_NX_QTY: object.QTY,
               TRD_K_U_PRC: object.SPCLARPLU_U_PRC,
               TRD_Q_FREE: '',
               TRD_DSC_KEYIN: ''
            }
         })
         state.basketProductERP = newData
      },
      clearBasket: (state: authState) => {
         state.basketProduct = [];
      },
      calBasket: (state: authState, action: PayloadAction<any>) => {
         state.basketProduct = action.payload;
      },
   },
})

export const { itemBasket, updateBasket, clearBasket, calBasket, updatePrepareDocumentt } = basketSlice.actions;
export const basketSelector = (store: RootState) => store.basketReducer;
export default basketSlice.reducer;