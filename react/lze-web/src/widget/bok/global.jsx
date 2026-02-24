import { create } from 'zustand';
import {Api} from '../../utils/request'
import { PageInit } from '../../utils/pageInit';
import { GetText, notify } from '../../utils/common';
// 全局变量
export const useGlobal = create((set, get) => ({
  userName: window.localStorage.getItem('userName'),
  token: window.localStorage.getItem('token'),
  showBg: false,
  loading: false,
  langList:[],
  bokList:[],
  fileWin:false,
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
// 添加新书签

export function addBok(name,text){
    if(name=="")
        name="new_bookmark"
    if(!isUrl(text)){
        notify.err(GetText("bok_url")+" "+GetText("error")+" "+text)
        return
    }
Api.post({
    api:'bok/add',
    body:{name,text},
    notice:true,
    success:()=>{
        list()
    }
})
}

function isUrl(str){
  try {
     const url = new URL(str);
     if(url.protocol=="doc:"){
      return true
     }
    return url.hostname.includes('.');
  } catch (e) {
    return false;
  }
}