import { create } from "zustand";

export const useMouseMenuStore = create((set, get) => ({
  menuOpt: {}, // 初始菜单为空

  // 支持增量更新菜单项
  setMenuOpt: (key, value) => {
    set((state) => ({
      menuOpt: {
        ...state.menuOpt,
        [key]: {
          ...state.menuOpt[key],
          ...value,
        },
      },
    }));
  },

  // 获取当前菜单项对象
  getMenuOpt: () => get().menuOpt,
}));

// 快捷函数
export const setMenuOption = (key, value) =>
  useMouseMenuStore.getState().setMenuOpt(key, value);

export const getMenuOptions = () =>
  useMouseMenuStore.getState().getMenuOpt();
