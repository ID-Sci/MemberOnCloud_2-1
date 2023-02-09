import { Alert } from "react-native";
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

import axios, { AxiosResponse, AxiosError } from 'axios';

type authState = {
    isLogin: boolean,
    isTokenExpire: boolean,
    userId: number,
    username: string,
    userToken: string
}

const initialState: authState = {
    isLogin: false,
    isTokenExpire: false,
    userId: 0,
    username: "",
    userToken: ""
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signIn: (state: authState, action: PayloadAction<string>) => {
            state.isLogin = action.payload ? true : false;
            state.userToken = action.payload;
        },
        signOut: (state: authState, action: PayloadAction<void>) => {
            state.isLogin = false;
        },
    },
    extraReducers: (builder) => { }
})

 

export const { signIn, signOut } = authSlice.actions;
export const authSelector = (store: RootState) => store.authReducer;
export default authSlice.reducer;