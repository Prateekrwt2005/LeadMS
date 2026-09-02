import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      hasHydrated: false,

      login: (data) => {
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        });
      },

      updateTokens: (accessToken, refreshToken) => {
        set({
          accessToken,
          ...(refreshToken ? { refreshToken } : {}),
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setHasHydrated: (hasHydrated) => {
        set({ hasHydrated });
      },
    }),
    {
      name: "leadms-auth",

      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Auth state hydration failed:", error);
        }

        state?.setHasHydrated(true);
      },
    }
  )
);

export default useAuthStore;