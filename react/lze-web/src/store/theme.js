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
  }
}));
