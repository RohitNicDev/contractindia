import { create } from "zustand";

export const userStore = create((set) => ({
  userProfile: null,
  setUserProfile: (profile) => set({ userProfile: profile }),
  token: null,
  setToken: (token) => set({ token }),
  refreshToken: null,
  setRefreshToken: (refreshToken) => set({ refreshToken }),
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  loginResponse: null,
  setLoginResponse: (response) => set({ loginResponse: response }),
}));
