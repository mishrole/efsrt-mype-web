import { create } from "zustand"
import { persist } from "zustand/middleware"
import { BUSINESS_CONTEXT_STORAGE_KEY } from "./constants"
import type { BusinessContextState } from "./interfaces"

const initialState = {
  businesses: [],
  currentBusinessId: null,
  context: null,
}

export const useBusinessContextStore = create<BusinessContextState>()(
  persist(
    (set) => ({
      ...initialState,
      setBusinesses: (businesses) => set({ businesses }),
      selectBusiness: (currentBusinessId) =>
        set({ currentBusinessId, context: null }),
      setContext: (context) => set({ context }),
      clearBusinessContext: () => set(initialState),
    }),
    {
      name: BUSINESS_CONTEXT_STORAGE_KEY,
      partialize: (state) => ({ currentBusinessId: state.currentBusinessId }),
    },
  ),
)
