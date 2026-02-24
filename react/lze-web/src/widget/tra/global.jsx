import { create } from 'zustand';
import {Api}from '../../utils/request';
import { PageInit } from '../../utils/pageInit';
// 全局变量
export const useGlobal = create((set, get) => ({
  userName: window.localStorage.getItem('userName'),
  token: window.localStorage.getItem('token'),
  nowPath: "",
  parentPath: "",
  fileList: [],
  uploading: false,
  showBg: false,
  loading: false,
  selected: [],
  source_path:true,
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
PageInit("tra")
  list("")
}
// 扫描目录
export function list(path) {
    Api.post({
      api:"tra/list",
      body:{folder: path},
      success:(data)=>{
      let sourcePath
      if(data.currentFolder==""){
        sourcePath = true
      }else{
        sourcePath = false
      }
      useGlobal.setState({
        fileList: data.filelist,
        nowPath: data.currentFolder,
        parentPath: data.parentFolder,
        source_path:sourcePath,
        selected: [],
      });

      }
    })
}
