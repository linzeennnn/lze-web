import { create } from "zustand";

export const useEnvStore = create((set) => ({
  env: {
    type:"",
    root:""
  },

  setenv: (envMsg) => {
    set({ env: envMsg });
  }
}));
export const getEnv = () => useEnvStore.getState().env;
export const setEnv = (envMsg) => useEnvStore.getState().setenv(envMsg);