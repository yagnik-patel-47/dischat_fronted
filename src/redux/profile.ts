import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "../utils/interfaces";

const initialState: Profile = {
  id: "",
  username: "",
  email: "",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    initProfileData: (state, action: PayloadAction<Profile | any>) => {
      return {
        id: action.payload._id,
        username: action.payload.username,
        email: action.payload.email,
      };
    },
  },
});

export const { initProfileData } = profileSlice.actions;
export default profileSlice.reducer;
export { initialState };
