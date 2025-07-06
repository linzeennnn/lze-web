import { create } from 'zustand';

const useGlobal = create((set, get) => ({
  userName: window.localStorage.getItem('userName'),
  token: window.localStorage.getItem('token'),
  nowPath: '/',
  parentPath: '/',
  fileList: [],
  creating: false,
  uploading: false,
  showBg: false,
  loading: false,
  selected: [],

  // 通用 setter（合并更新）
  setGlobal: (partial) => {
    set((state) => ({ ...state, ...partial }));
  },

  // 直接替换整个 global 状态（慎用）
  replaceGlobal: (newState) => {
    set(() => ({ ...newState }));
  },

  // 类似 getGlobal
  getGlobal: () => get(),
}));
export default useGlobal;
