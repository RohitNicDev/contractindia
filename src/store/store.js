import { create } from "zustand";

export const useUserStore = create((set) => ({
  loginResponce: {},
  setloginResponce: (responce) => set({ loginResponce: responce }),
  userDetails: null,
  setUserDetails: (data) => set({ userDetails: data }),
  userProfile: null,
  setUserProfile: (userProfile) => set({ userProfile }),
  token: null,
  setToken: (token) => set({ token }),
  User: null,
  setUser: (user) => set({ user }),
  User: null,
}));
export const useserviceStore = create((set) => ({
  allServices: null,
  setAllServices: (services) => set({ allServices: services }),

  selectedService: null,
  setSelectedService: (service) => set({ selectedService: service }),

  serviceTree: [],
  setServiceTree: (tree) => set({ serviceTree: tree }),
}));
