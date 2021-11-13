import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  chatDetails: false,
  chat: true,
};

const profileSlice = createSlice({
  name: "drawers",
  initialState,
  reducers: {
    setChatDrawer: (state, action: PayloadAction<boolean>) => {
      return {
        chatDetails: state.chatDetails,
        chat: action.payload,
      };
    },
    setBothDrawer: (
      _state,
      action: PayloadAction<{ chatDetails: boolean; chat: boolean }>
    ) => {
      return {
        chat: action.payload.chat,
        chatDetails: action.payload.chatDetails,
      };
    },
  },
});

export const { setChatDrawer, setBothDrawer } = profileSlice.actions;
export default profileSlice.reducer;
