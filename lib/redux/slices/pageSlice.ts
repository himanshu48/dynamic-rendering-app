import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';

export type PageState = {
    title: string;
    titleSuffix?: string;
    metaDescription: string;
};

const initialState: PageState = {
  title: 'BlogTitle',
  metaDescription: 'BlogMetaDescription',
};

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateTitle: (state, action: PayloadAction<string>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.title = action.payload;
    },
    updateTitleSuffix: (state, action: PayloadAction<string>) => {
      state.titleSuffix = action.payload;
    },
    updateMetaDescription: (state, action: PayloadAction<string>) => {
      state.metaDescription = action.payload;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateTitleAndMetaDescription: (
      state,
      action: PayloadAction<{
        title: string;
        metaDescription: string;
        titleSuffix?: string;
      }>
    ) => {
      state.title = action.payload.title;
      state.metaDescription = action.payload.metaDescription;
      state.titleSuffix = action.payload.titleSuffix;
    },
  },
});

export const {
  updateTitle,
  updateMetaDescription,
  updateTitleSuffix,
  updateTitleAndMetaDescription,
} = pageSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectTitle = (state: RootState) => state.page.title;

export const selectMetaDescription = (state: RootState) =>
  state.page.metaDescription;

export const selectTitleSuffix = (state: RootState) => state.page.titleSuffix;

export default pageSlice.reducer;