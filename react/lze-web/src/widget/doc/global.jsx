import { create } from 'zustand';
import { PageCom } from '../../components/pageCom';
import { GetText,loadingPage,notify } from '../../utils/common';
import {baseName, dirName} from '../../utils/path'
import { Api, AsyncApi } from '../../utils/request';
import { getToken, getUrl } from '../../store/request';
import { GetPageSession, SetPageSession } from '../../utils/pageSession';
import { PageUrl } from '../../utils/page';
// 全局变量
export const useGlobal = create((set, get) => ({
  nowPath: "",
  parentPath: "",
  fileList: [],
  uploading: false,
  linkWin:{
    show:false,
    link:""
  },
  showBg: false,
  loading: false,
  dragWin:false,
  fileWin:{
    status:false,
    url:"",
    view:false,
    innerApp:[]
  },
    
    theme:{
      mode:"",
      color:{
        doc:""
      },
      userSelect:""
    },
  upload:{
    win:false,
    status:false,
    percent:"0%"
  },
  selected: [],
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
PageCom(useGlobal.setState,"doc")
// 获取别的页面传递需要加载的目录
  const pageSession=GetPageSession()
  const path=pageSession.doc.list.path
  list(path)
}
// 扫描目录
export function list(path) {
const pageSession=GetPageSession()
const sessionPath=pageSession.doc.list.path
Api.post({
  api:"doc/list",
  body:{file: path},
  success:(data)=>{
      loadPage(false)
      if(data.type=="dir"){
      useGlobal.setState({
        fileList: data.filelist,
        nowPath: data.currentFolder,
        parentPath: data.parentFolder,
        selected: [],
      });
      if(sessionPath!=""){
        pageSession.doc.list.path=""
        SetPageSession(pageSession)
      }
    }
      if(data.type=="file"){
        SetInnerSession(path,data.innerApp[0],data.url)
        useGlobal.setState({
          fileWin:{
            status:true,
            url:GetListFileUrl(data.innerApp[0]),
            view:(data.innerApp.length!=0)
          }
        })
      }
  }
})
}
// 获取list file的url
export function GetListFileUrl(type){
  let url
  switch (type) {
          case "doc":
            url=PageUrl(data.url)
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
      if(sessionPath!=""){
        pageSession.doc.list.path=""
        list("")
      }
    let inner={
      source:"doc",
      enable:true,
      name:baseName(path)
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
 }
// 加载页面
export function loadPage(isLoad){
  useGlobal.setState({
    loading: isLoad,
    showBg: isLoad
  });
}

// 上传文件
export function Upload(file, uploadData, type) {
  if (file.size == 0) {
    notify.err(GetText("error") + ":" + file.name + GetText("is_empty"));
    return;
  }
  const global = useGlobal.getState();
  const token = getToken()
  const nowPath = global.nowPath;
  const upload = global.upload;
  const setGlobal = useGlobal.setState;
  const api=getUrl()+"doc/"
  const url =
    type === "file"
      ? api + "upload_file"
      : api + "upload_folder";

  const chunkSize = getChunkSize(file.size);
  const totalChunks = Math.ceil(file.size / chunkSize);
  let start = 0;

  function uploadChunk() {

    if (uploadData.sendSize >= uploadData.totalSize&&(!uploadData.completed)) {
      setGlobal({
        upload: {
          ...upload,
          status: false,
        },
      });

      if (type === "file") {
        uploadData.completed=true
        notify.normal(GetText("op_com"));
        list(nowPath);
      } else if (type === "dir") {
        const foldername = file.webkitRelativePath.split("/")[0];
        movefolder(foldername);
      }

      return;
    }

    if (start >= file.size) {
      return;
    }
    let tmp_send_size = 0;
    let percent = 0;
    const chunk = file.slice(start, start + chunkSize);
    const curChunk = Math.floor(start / chunkSize);
    const formData = new FormData();

    formData.append("file", chunk);
    formData.append("fileName", file.name);
    formData.append("totalChunks", totalChunks);
    formData.append("currentChunk", curChunk);
    if (type === "dir") {
      const relativePath = file.webkitRelativePath;
      formData.append("relativePath", relativePath);
    }

    if (type === "file") {
      formData.append("nowpath", nowPath);
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    // 通过 Header 发送 user 和 token
    xhr.setRequestHeader("authorization", "Bearer " + token);

    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        uploadData.sendSize = uploadData.sendSize + Math.min(event.loaded, file.size) - tmp_send_size;
        tmp_send_size = event.loaded;
        percent = Math.floor((uploadData.sendSize / uploadData.totalSize) * 100) + "%";
        setGlobal({
          upload: {
            ...upload,
            percent: percent,
          },
        });
      }
    };

    xhr.onload = function () {
      if (xhr.status != 200) {
        if (xhr.status == 401) {
          notify.err(GetText("no_per"));
          
        } else {
          notify.err(GetText("error") + ":" + xhr.status);
        }
        setGlobal({
          upload: {
            ...upload,
            status: false,
          },
        });
        uploadData.completed=true
        return;
      } else {
        start += chunkSize;
        uploadChunk();
      }
    };

    xhr.onerror = function () {
      console.error(`Chunk ${curChunk + 1} upload encountered error.`);
      setGlobal({ upload: false });
    };

    xhr.send(formData);
  }
  uploadChunk();
}
// 从temp移动文件夹
function movefolder(foldername) {
  const global = useGlobal.getState();
Api.post({
  api:"doc/move_folder",
  body:{name: foldername,
        path: global.nowPath
        },
  success:()=>{
        list(global.nowPath)
  }
})
}
// 获取块大小
function getChunkSize(fileSize) {
    const mb = 1024 * 1024;

    if (fileSize <= 100 * mb) {
        return 2 * mb;
    } else if (fileSize <= 1024 * mb) {
        return 5 * mb;
    } else if (fileSize <= 10240 * mb) {
        return 10 * mb;
    } else {
        return 20 * mb;
    }
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

  function traverseFileTree(item, path = "") {
    if (item.isFile) {
      pending++;
      item.file((file) => {
        if (path) {
          Object.defineProperty(file, "webkitRelativePath", {
            value: path + file.name,
          });
        }
        fileList.push(file);
        totalSize += file.size;
        pending--;
        maybeUpload();
      });
    } else if (item.isDirectory) {
      const dirReader = item.createReader();
      pending++;
      dirReader.readEntries((entries) => {
        pending--;
        for (const entry of entries) {
          traverseFileTree(entry, path + item.name + "/");
        }
        maybeUpload();
      });
    }
  }
async  function maybeUpload() {
    if (pending === 0) {
      if (fileList.length === 0) {
        notify.err(GetText("empty"));
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
        completed:false
      };
      const type=fileList[0].webkitRelativePath ? "dir" : "file";
    const permitted = await UploadPermit(type);
    if (!permitted) {
      return;
    }
      fileList.forEach((file) => {
        Upload(file, uploadData, type);
      });
    }
  }
  for (let i = 0; i < items.length; i++) {
    const entry = items[i].webkitGetAsEntry();
    if (entry) {
      traverseFileTree(entry);
    }
  }
}
// 检查是否能有上传权限
export async function UploadPermit(type){
  const upload = useGlobal.getState().upload;
if (await AsyncApi.post({
  api:"login/upload",
  body:{appType:"doc",fileType:type}
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