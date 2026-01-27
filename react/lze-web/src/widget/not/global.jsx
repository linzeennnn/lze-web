import { create } from 'zustand';
import { GetText,notify } from '../../utils/common';
import { Api, AsyncApi } from '../../utils/request';
import { getUrl } from '../../store/request';
import { GetPageSession, SetPageSession } from '../../utils/pageSession';
import { PageInit } from '../../utils/pageInit';
// 全局变量
export const useGlobal = create((set, get) => ({
  userName: window.localStorage.getItem('userName'),
  token: window.localStorage.getItem('token'),
  uploading: false,
  showBg: false,
  loading: false,
  langList:[],
  dragWin:false,
  notList:[],
  inner:{
    enable:false,
    source:"",
    path:"",
    name:""
  },
  listSession:{
    path:""
  },
  edit:{
    mode:false,
    title:"",
    text:"",
    type:""
  },
  upload:{
    status:false,
    percent:"0%"
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

const pageSession = GetPageSession();
const {
  not: {
    list: { path },
    inner
  }
} = pageSession;
 PageInit("not")
// 同步到 zustand（复制一份，断引用）
useGlobal.setState({
  listSession: { path },
  inner: { ...inner }
});

// reset session
pageSession.not.inner = {
  enable: false,
  source: "",
  path: "",
  name: ""
};
pageSession.not.list.path = "";

SetPageSession(pageSession);
list();
}
//初始化编辑数据
function init_edit(){
  const edit = useGlobal.getState().edit;
  const setGlobal = useGlobal.setState;
  if(edit.type!="edit"){
  setGlobal({edit:{
    mode:false,
    title:"",
    text:"",
    type:""
  }})}
}
// 扫描目录
export function list(){
const inner=useGlobal.getState().inner
if(!inner.enable)
    {Api.get({
      api:'not/list',
      success:(data)=>{
        useGlobal.setState({
          notList:data
        })
        init_edit()
      }
    })
  }else{
        useGlobal.setState({
          notList:[inner.name]
        })
  }
}

// 保存文件
export function Save_note(newTitle,newContent){
    const edit=useGlobal.getState().edit
    const inner=useGlobal.getState().inner
    const oldTitle=edit.title
    newTitle=newTitle==""?"new_note":newTitle
    Api.post({
      api:'not/'+edit.type,
      body:{oldTitle,newTitle,newContent,
        source:inner.source,
        path:inner.path
      },
      notice: true,
      success:()=>{
        list()
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
// 上传文件
export async function Upload(file, uploadData) {
  const setGlobal = useGlobal.setState;
  const upload = useGlobal.getState().upload;

  if (file.size === 0) {
    notify.err(GetText("error") + GetText("is_empty"));
    setGlobal({ upload: { ...upload, status: false } });
    return;
  }

  if (file.size > 1024 * 1024) { 
    notify.err(GetText("no_more_than") + "1MB");
    setGlobal({ upload: { ...upload, status: false } });
    return;
  }

  const isTextFile = await isText(file);
  if (!isTextFile) {
    notify.err(file.name + GetText("not_text"));
    setGlobal({ upload: { ...upload, status: false } });
    return;
  }

  let tmp_send_size = 0;
  let percent = "";
  const url = getUrl() + "not/upload";
  const xhr = new XMLHttpRequest();
  const formData = new FormData();
  const user = useGlobal.getState().userName;
  const token = useGlobal.getState().token;

  formData.append("new_note", file);

  xhr.upload.onprogress = function (event) {
    if (event.lengthComputable) {
      uploadData.sendSize = Math.min(event.loaded, file.size) + uploadData.sendSize - tmp_send_size;
      tmp_send_size = event.loaded;
      percent = Math.floor((uploadData.sendSize / uploadData.totalSize) * 100);
      setGlobal({
        upload: {
          ...upload,
          percent: percent + "%",
        },
      });
    }
  };

  xhr.onload = function () {
    if (xhr.status !== 200) {
      if (xhr.status === 401) {
        notify.err(GetText("no_per"));
      } else {
        notify.err(GetText("error") + xhr.status);
      }
      setGlobal({ upload: { ...upload, status: false } });
      return;
    }

    if (uploadData.sendSize >= uploadData.totalSize) {
      setGlobal({ upload: { ...upload, status: false } });
      notify.normal(GetText("op_com"));
      list();
    }
  };

  xhr.onerror = function () {
    notify.err(GetText("error"));
    setGlobal({ upload: { ...upload, status: false } });
  };

  xhr.open("POST", url);

  // 将 user 和 token 作为 Header 发送
  xhr.setRequestHeader("authorization", "Bearer " + token);

  xhr.send(formData);
}

//拖拽上传
export function DragOver(e) {
  
    useGlobal.setState({ dragWin: true });
    e.stopPropagation();
    e.preventDefault();
}
export function DragLeave(e) {
    useGlobal.setState({ dragWin: false });
    e.stopPropagation();
    e.preventDefault();
}
export function Drop(e) {
  const global = useGlobal.getState();
  const upload = global.upload;
  const setGlobal = useGlobal.setState;

  setGlobal({ dragWin: false });

  e.stopPropagation();
  e.preventDefault();

  const items = e.dataTransfer.items;
  const fileList = [];
  let totalSize = 0;

  let pending = 0;

  function handleItem(item) {
    const entry = item.webkitGetAsEntry();
    if (!entry) return;

    if (entry.isDirectory) {
      notify.err(GetText("not_support_type"));
      return;
    }

    if (entry.isFile) {
      pending++;
      entry.file((file) => {
        fileList.push(file);
        totalSize += file.size;
        pending--;
        maybeUpload();
      });
    }
  }

async  function maybeUpload() {
    if (pending === 0) {
      if (fileList.length === 0) {
        notify.err(GetText("no_select_file"));
        return;
      }

      setGlobal({
        upload: {
          ...upload,
          status: true,
          win: false,
        },
      });

      const uploadData = {
        totalSize: totalSize,
        sendSize: 0,
      };
 const permitted = await UploadPermit();
            if (!permitted) {
              return;
            }
            
      fileList.forEach((file) => {
        Upload(file, uploadData); // type 参数已从 Upload 中移除
      });
    }
  }

  for (let i = 0; i < items.length; i++) {
    handleItem(items[i]);
  }
}
function isText(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    const sampleSize = 512;
    const blob = file.slice(0, sampleSize);

    reader.onload = () => {
      const text = reader.result;
      let nonPrintable = 0;
      for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i);
        // 排除换行、回车、制表符
        if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
          nonPrintable++;
        }
      }
      const ratio = nonPrintable / text.length;
      resolve(ratio < 0.1); // 不可打印字符比例小于 10% 认为是文本
    };

    reader.onerror = () => {
      resolve(false);
    };

    reader.readAsText(blob); // 使用 UTF-8 解码尝试读取为文本
  });
}
// 检查是否能有上传权限
export async function UploadPermit(){
  const upload = useGlobal.getState().upload;
if (await AsyncApi.post({
  api:"login/upload",
  body:{appType:"not",fileType:""}
})==null){
  useGlobal.setState({
              upload: {
                ...upload,
                status: false
              }
            })
        return false
        }
        return true
}