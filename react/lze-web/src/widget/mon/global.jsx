import { create } from 'zustand';
import { PageCom } from '../../components/pageCom';
import {Api, AsyncApi}from '../../utils/request'
// 全局变量
export const useGlobal = create((set, get) => {
  const storedUser = window.localStorage.getItem('userName');
  const storedToken = window.localStorage.getItem('token');
  return {
    userName: storedUser,
    token: storedToken,
    nowuser: storedUser?.trim() || 'guest',
    showBg: false,
    loading: false,
    controlList: null,
    langList:[],
    userList: null,
    showCmd:false,
    showLogout:false,
    theme:{
      mode:"",
      color:{
        mon:""
      }
    },
    monUrl: `${window.location.origin}/server/mon/`,
    setGlobal: (partial) => {
      set((state) => ({ ...state, ...partial }));
    },
    replaceGlobal: (newState) => {
      set(() => ({ ...newState }));
    },
    getGlobal: () => get(),
  };
});
// 初始化
export function InitData(){
PageCom(useGlobal.setState,"mon")
  list()
}
// 加载页面
export function loadPage(isLoad){
  useGlobal.setState({
    loading: isLoad,
    showBg: isLoad
  });
}
//获取配置
export function list(){
Api.get({
  api:'mon/list',
  success:(data)=>{
    useGlobal.setState({controlList:data.control,userList:data.user})
  }
})
}