import { createSlice } from "@reduxjs/toolkit";
import loggedInInfoReducer from "./loggedInInfoReducer";

const initialState = {
  role: null,
  id: null,
  isSignedIn: false,
};

const loggedInInfoSlice = createSlice({
  name: "loggedInInfo",
  initialState,
  reducers: loggedInInfoReducer,
});

export const { setInitialLoggedInInfo, removeLoggedInInfo } = loggedInInfoSlice.actions;
export default loggedInInfoSlice.reducer;
