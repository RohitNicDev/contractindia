import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useProfileWizardStore } from "./profileWizardStore";

export const useUserStore = create(
  persist(
    (set) => ({
      loginResponce: {},
      userDetails: null,
      userProfile: null,
      token: null,
      user: null,

      setloginResponce: (responce) => set({ loginResponce: responce }),

      setUserDetails: (data) => set({ userDetails: data }),

      setUserProfile: (userProfile) => set({ userProfile }),

      setToken: (token) => set({ token }),

      setUser: (user) => set({ user }),

      resetUserStore: () =>
        set({
          loginResponce: {},
          userDetails: null,
          userProfile: null,
          token: null,
          user: null,
        }),
    }),
    {
      name: "user-storage", // localStorage key
    },
  ),
);

export const useServiceStore = create(
  persist(
    (set) => ({
      allServices: null,
      setAllServices: (services) => set({ allServices: services }),

      allMenuServices: null,
      setMenuServices: (services) => set({ allMenuServices: services }),

      selectedService: null,
      setSelectedService: (service) => set({ selectedService: service }),

      serviceTree: [],
      setServiceTree: (tree) => set({ serviceTree: tree }),
    }),
    {
      name: "service-store", // localStorage key
    },
  ),
);
export const resetAllStores = () => {
  // Reset state
  localStorage.removeItem("user-storage");
  localStorage.removeItem("contracts_india_profile_wizard_draft_v1");
};
