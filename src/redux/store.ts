import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profile";
import drawersReducer from "./drawers";

const store = configureStore({
  reducer: {
    profile: profileReducer,
    drawers: drawersReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
