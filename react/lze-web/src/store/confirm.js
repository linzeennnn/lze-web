import { create } from "zustand";

export const useConfirmStore = create((set) => ({
  msg: "",
  type: "",
  show: false,
  resolve: null,   

  normal: (text, resolve) => {
    set({
      msg: text,
      type: "normal",
      show: true,
      resolve
    });
  },

  err: (text, resolve) => {
    set({
      msg: text,
      type: "err",
      show: true,
      resolve
    });
  },

  close: (result) => set((state) => {
    state.resolve && state.resolve(result);
    return {
      show: false,
      msg: "",
      type: "",
      resolve: null
    };
  })
}));
