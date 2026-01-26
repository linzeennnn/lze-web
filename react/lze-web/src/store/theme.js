import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: {
    mode: "",
    color: {
      home: "",
      doc: "",
      pic: "",
      tra: "",
      mon: "",
      not: "",
      bok: ""
    },
    userSelect:""
  },

  setTheme: (themeMsg) => {
    set({ theme: themeMsg });
  },

  setThemeMode: (mode) => {
    set((state) => ({
      theme: {
        ...state.theme,
        mode
      }
    }));
  },

  setThemeColor: (key, value) => {
    set((state) => ({
      theme: {
        ...state.theme,
        color: {
          ...state.theme.color,
          [key]: value
        }
      }
    }));
  }
}));
