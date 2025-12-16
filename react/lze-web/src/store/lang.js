import { create } from "zustand";

export const useLangStore = create((set) => ({
  lang:{
      type:"",
      list:{},
      userSelect:""
    },
  setLang: (langMsg) => {
    set({ lang:langMsg  });
  }
}));
export const setLang = (langMsg) => useLangStore.getState().setLang(langMsg)
export const getLang = () => useLangStore.getState().lang;
export const getLangType= () => useLangStore.getState().lang.type;