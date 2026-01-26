import { create } from 'zustand';
import {Api} from '../../utils/request'
import { PageInit } from '../../utils/pageInit';
// 全局变量
export const useGlobal = create((set, get) => ({
  userName: window.localStorage.getItem('userName'),
  token: window.localStorage.getItem('token'),
  showBg: false,
  loading: false,
  langList:[],
  bokList:[],
  setGlobal: (partial) => {
    set((state) => ({ ...state, ...partial }));
  },
  replaceGlobal: (newState) => {
    set(() => ({ ...newState }));
  },
  getGlobal: () => get(),
}));
// 初始化
export function InitData(){
PageInit("bok")
  list()
}
// 扫描目录
export function list(){
Api.get({
  api:'bok/list',
  success:(data)=>{
    useGlobal.setState({
      bokList:data,
    })
  }
})
}
// 加载页面
export function loadPage(isLoad){
  useGlobal.setState({
    loading: isLoad,
    showBg: isLoad
  });
}
