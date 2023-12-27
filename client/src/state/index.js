import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  user: null,
  token: null,
  company: null,
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setCompany: (state, action) => {
      state.company = action.payload.company;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.company = null;
    },
    setUserCompany: (state, action) => {
      state.user.companies =
        state.user.companies.indexOf(action.payload.company) === -1
          ? state.user.companies.push(action.payload.company)
          : state.user.companies;
    },
  },
});

export const { setMode, setLogin, setLogout, setCompany, setUserCompany } =
  userSlice.actions;
export default userSlice.reducer;
