import { create } from "zustand";

export const useApiStore = create((set) => ({
  request:{
    api:"",
    token:""
  },
  setApi: (langMsg) => {
    set({ lang:langMsg  });
  }
}));
export function InitApi(){
    useLangStore.getState().setApi(window.location.origin+"/")
}
export const setApi = (url) => useLangStore.getState().setApi(url)
export const getLang = () => useLangStore.getState().api;
