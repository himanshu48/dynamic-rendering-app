import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../store";

export type PageState = {
  assets: any;
};

const initialState: PageState = {
  assets: {},
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateAssets: (state, action: PayloadAction<any>) => {
      state.assets = action.payload;
    },
  },
});

export const { updateAssets } = mainSlice.actions;

export default mainSlice.reducer;
