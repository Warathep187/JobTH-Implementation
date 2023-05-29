import { configureStore } from "@reduxjs/toolkit";
import loggedInInfoReducer from "./reducers/loggedInInfoSlice";

const store = configureStore({
  reducer: {
    loggedInInfo: loggedInInfoReducer,
  },
});

export default store;
