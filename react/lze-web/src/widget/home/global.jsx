import { create } from 'zustand';
import { auth } from './fun';

const useGlobal = create((set, get) => {
  let userName = window.localStorage.getItem('userName') || 'visitor';
  let token = window.localStorage.getItem('token') || '';

  // 调用 auth 只一次（等价于 useEffect）
  auth(userName, token);

  return {
    userName,
    token,
    showBg: false,

    // 合并式更新
    setGlobal: (partial) => {
      set((state) => ({ ...state, ...partial }));
    },

    // 替代 getGlobal()
    getGlobal: () => get(),

    // 替代 setGlobal()
    replaceGlobal: (newState) => {
      set(() => ({ ...newState }));
    },
  };
});

export default useGlobal;
