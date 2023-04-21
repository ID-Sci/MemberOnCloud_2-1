import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import authReducer from './slices/authReducer'
import configReducer from './slices/configReducer'
import emptyTankReducer from './slices/emptyTankReducer'
import projReducer from './slices/projReducer'
import promotionReducer from './slices/promotionReducer'
import categoryReducer from './slices/categoryReducer'
import bannerReducer from './slices/bannerReducer'
import newproductReducer from './slices/newproductReducer'
import activityReducer from './slices/activityReducer'
import mycardReducer from './slices/mycardReducer'
import notificationReducer from './slices/notificationReducer'
import basketReducer from './slices/basketReducer'

const reducer = {
   authReducer,
   configReducer,
   emptyTankReducer,
   projReducer,
   promotionReducer,
   notificationReducer,
   categoryReducer,
   bannerReducer,
   newproductReducer,
   activityReducer,
   mycardReducer,
   basketReducer
}

export const store = configureStore({ reducer });

// Export type of root state from reducers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;