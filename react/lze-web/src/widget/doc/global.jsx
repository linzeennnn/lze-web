import { create } from 'zustand';
import { GetText,notify } from '../../utils/common';
import {baseName, dirName} from '../../utils/path'
import { Api, AsyncApi } from '../../utils/request';
import { getToken, getUrl } from '../../store/request';
import { GetPageSession, SetPageSession } from '../../utils/pageSession';
import { PageUrl } from '../../utils/page';
import { PageInit } from '../../utils/pageInit';
import { AddCacheList } from '../../utils/CacheList';
import { getFileList, getNowPath } from '../../store/CacheList';
// 全局变量
export const useGlobal = create((set, get) => ({
  linkWin:{
    show:false,
    link:""
  },
  edit:{
    status:false,
    fileName:""
  },
  fileBuffer:{
    source:-1,
    dest:-1,
    selected:{
    selected: [],
    status:false
  },
    newFileList:[]
  },
  showBg: false,
  fileWin:{
    status:false,
    url:"",
    view:false,
    data:null,
    currentType:"",
    path:""
  },
  uploadWin:false,
  selected:{
    selected: [],
    status:false
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
PageInit("doc")
// 获取别的页面传递需要加载的目录
  const pageSession=GetPageSession()
  const path=pageSession.doc.list.path
  list(path)
}
///////// buffer相关//////////////
export const fileBuffer = {

  // 添加/移除选中
 add: (index) => {
  useGlobal.setState(s => {
    const fb = s.fileBuffer;
    const selObj = fb.selected;
    const arr = selObj.selected;

    let newArr;

    if (arr.includes(index)) {
      // 移除
      newArr = arr.filter(item => item !== index);
    } else {
      // 添加
      newArr = [...arr, index];
    }

    return {
      fileBuffer: {
        ...fb,
        selected: {
          selected: newArr,
          status: newArr.length > 0   // 是否有选中
        }
      }
    };
  });
},

  include: (index) => {
  return useGlobal
    .getState()
    .fileBuffer
    .selected
    .selected
    .includes(index);
},
  open: () => {
    useGlobal.setState(s => ({
      fileBuffer: {
        ...s.fileBuffer,
        selected: {
          ...s.fileBuffer.selected,
          status: true
        }
      }
    }));
  },
  hide: () => {
    useGlobal.setState(s => ({
      fileBuffer: {
        ...s.fileBuffer,
        selected: {
          ...s.fileBuffer.selected,
          status: false
        }
      }
    }));
  },
  clean: () => {
    useGlobal.setState(s => ({
      fileBuffer: {
        ...s.fileBuffer,
        selected: {selected:[],status:false},
        source: -1,
        dest: -1,
        newFileList: []
      }
    }));
  },

  // ===== getters =====
  getSelected: () => useGlobal.getState().fileBuffer.selected.selected,
  getSource: () => useGlobal.getState().fileBuffer.source,
  getDest: () => useGlobal.getState().fileBuffer.dest,
  getNewFileList: () => useGlobal.getState().fileBuffer.newFileList,
  getSelectedFileList:()=>{
      const fileList=getFileList()
      const selected=fileBuffer.getSelected()
      const selectedFileList=[]
      for (const i of selected) {
          selectedFileList.push(fileList[i][0]);
        }
      return selectedFileList
  },
  // ===== setters =====
  setSource: (index) => {
    useGlobal.setState(s => ({
      fileBuffer: {
        ...s.fileBuffer,
        source: index
      }
    }));
  },

  setDest: (index) => {
    useGlobal.setState(s => ({
      fileBuffer: {
        ...s.fileBuffer,
        dest: index
      }
    }));
  },

  setNewFileList: (list) => {
    useGlobal.setState(s => ({
      fileBuffer: {
        ...s.fileBuffer,
        newFileList: list
      }
    }));
  },

  setSelected: (arr) => {
    useGlobal.setState(s => ({
      fileBuffer: {
        ...s.fileBuffer,
        selected: arr
      }
    }));
  }
};
// //////////////////////
// 扫描目录
export function list(path) {
const pageSession=GetPageSession()
const sessionPath=pageSession.doc.list.path
Api.post({
  api:"doc/list",
  body:{file: path},
  success:(data)=>{
      if(data.type=="dir"){
      AddCacheList({
        nowPath:data.currentFolder,
        fileList:data.filelist,
        name:baseName(data.currentFolder)
      })
      if(sessionPath!=""){
        pageSession.doc.list.path=""
        SetPageSession(pageSession)
      }
    }
      if(data.type=="file"){
       SetFileWin(data,path)
      }
  }
})
}
// selected属性函数
export const Selected = {
  set: status =>
    useGlobal.setState(s => ({
      selected: { ...s.selected, selected: [], status }
    })),

  open: () => Selected.set(true),
  close: () => Selected.set(false),

  hide: () =>
    useGlobal.setState(s => ({
      selected: { ...s.selected, status:false }
    }))
}

// 设置文件窗口
export function SetFileWin(data,path){
   SetInnerSession(path,data.innerApp[0],data.url)
        const view=(data.innerApp.length!=0)
        useGlobal.setState({
          fileWin:{
            status:true,
            url:GetListFileUrl(data.innerApp[0],data.url),
            view:view,
            innerApp:data.innerApp,
            currentType:view?data.innerApp[0]:"",
            data:data,
            path:path
          }
        })
}
// 获取list file的url
export function GetListFileUrl(type,defaultUrl){
  let url
  switch (type) {
          case "doc":
            url=PageUrl(defaultUrl)
            break;
          case "img":
            url=PageUrl("pic")
            break;
          case "vid":
            url=PageUrl("pic")
            break;
          case "not":
            url=PageUrl("not")
            break;
          default:
            url=""
            break;
        }
      return url
}
// 设置inner的session
 export function SetInnerSession(path,type,url){
    const pageSession=GetPageSession()
const sessionPath=pageSession.doc.list.path
    let inner={
      source:"doc",
      enable:true,
      name:baseName(path),
      path
    }
    if(type=="img"||type=="vid"){
      if(type=="img")
        inner.media="img"
      if(type=="vid")
        inner.media="vid"
      inner.url=PageUrl(dirName(url)+"/")
      pageSession.pic.inner=inner
    }else if(type=="not"){
      inner.path=path
      pageSession.not.inner=inner
    }else{
      inner.source=""
      inner.enable=false
      inner.name=""
    }
    SetPageSession(pageSession)
    if(sessionPath!=""){
        list("")
      }
 }

