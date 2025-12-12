import { create } from "zustand";

export const useNotifyStore = create((set) => ({
  msg: "",
  type: "",
  show:false,

  normal: (text) => {
    set({ msg: text, type: "normal", show:true });
    setTimeout(() => set({show: false  }), 1000);
  },

  err: (text) => {
    set({ msg: text, type: "err", show:true });
    setTimeout(() => set({ show: false }), 1000);
  }
}));
export const showNotify = {
  normal: (text) => useNotifyStore.getState().normal(text),
  err: (text) => useNotifyStore.getState().err(text)
};
