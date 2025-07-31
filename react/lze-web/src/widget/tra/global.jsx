import { create } from 'zustand';
import { PageCom } from '../../components/pageCom';
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
  langList:[],
  selected: [],
  source_path:true,
    theme:{
      mode:"",
      color:{
        tra:""
      },
      userSelect:""
    },
  traUrl:`${window.location.origin}/server/tra/`,
  setGlobal: (partial) => {
    set((state) => ({ ...state, ...partial }));
  },
  replaceGlobal: (newState) => {
    set(() => ({ ...newState }));
  },
  getGlobal: () => get(),
}));
// 获取文本
export  function GetText(str){
  return useGlobal.getState().langList[str]
}
// 初始化
export function InitData(){
PageCom(useGlobal.setState,"tra")
  list("")
}
// 扫描目录
export function list(path) {
  const sendData = { folder: path };
  const url = useGlobal.getState().traUrl;

  loadPage(true)

  fetch(`${url}list`, {
    method: 'POST',
    body: JSON.stringify(sendData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      loadPage(false)
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
    });
}

// 加载页面
export function loadPage(isLoad){
  useGlobal.setState({
    loading: isLoad,
    showBg: isLoad
  });
}