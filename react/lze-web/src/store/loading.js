import { create } from "zustand";

export const useLoadingStore = create((set) => ({
  show:false,
  setShow: (show) => set({ show })
}));
export function setLoading (show){
    useLoadingStore.getState().setShow(show)
}
