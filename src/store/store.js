import { create } from "zustand";

export const useUserStore = create((set) => ({
  userProfile: null,
  setUserProfile: (profile) => set({ profile }),
  token: null,
  setToken: (token) => set({ token }),
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
