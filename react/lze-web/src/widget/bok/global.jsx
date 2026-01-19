import { create } from 'zustand';
import { PageCom } from '../../components/pageCom';
import { notify,GetText } from '../../utils/common';
import {Api} from '../../utils/request'
// 全局变量
export const useGlobal = create((set, get) => ({
  userName: window.localStorage.getItem('userName'),
  token: window.localStorage.getItem('token'),
  showBg: false,
  loading: false,
  langList:[],
  bokList:[],
  bokUrl:`${window.location.origin}/server/bok/`,
    theme:{
      mode:"",
      color:{
        bok:""
      }
    },
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
PageCom(useGlobal.setState,"bok")
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
