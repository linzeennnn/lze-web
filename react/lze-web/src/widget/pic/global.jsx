import { create } from 'zustand';
import { notify } from "../../utils/common";
import { dirName } from '../../utils/path';
import { GetText } from "../../utils/common";
import { Api, AsyncApi } from '../../utils/request';
import { getToken, getUrl } from '../../store/request';
import { GetPageSession, SetPageSession } from '../../utils/pageSession';
import { PageInit } from '../../utils/pageInit';
import { getEnv } from '../../store/common';
// 全局变量
export const useGlobal = create((set, get) => ({
  nowPath: "",
  parentPath: "",
  imgList: [],
  vidList: [],
  dirList: [],
  uploading: false,
  showBg: false,
  editWin:{
    status:false,
    url:"",
    index:0,
    newSaveImg:""
  },
  inner:{
    enable:false,
    source:"",  
    media:"",
    url:"",
    name:"",
    path:""
  },
  pageNum:1,
  listSession:{
    name:"",
    media:""
  },
  loading: false,
  dragWin:false,
  imgPage:true,
  mediaWin:{
    status:false,
    img:true,
    path:window.location.origin+"/file/Pictures/",
    index:0
  },
  select:{
    status:false,
    list:[]
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
PageInit("pic")
  const pageSession = GetPageSession();
 const { 
  pic: { 
    inner, 
    list: { path } 
  } 
} = pageSession;
  
  // 同步到 zustand（复制一份，断引用）
  useGlobal.setState({
    listSession: { ...path },
    inner: { ...inner },
    imgPage:(inner.media=="img")
  });
  
  // reset session
  pageSession.pic.inner = {
    enable: false,
    source: "",
    name: "",
    media:"",
    url: "",
    path:""
  };
  pageSession.pic.list.path = {name:"",media:""};
  SetPageSession(pageSession);
  list("",(useGlobal.getState().listSession.media=="vid"))
}
// 扫描目录
export function list(path,showVideo) {
  const inner=useGlobal.getState().inner
  const setGlobal=useGlobal.setState
  if(inner.enable){
    setGlobal({
      imgList:(inner.media=="img"?[[inner.name]]:[]),
      vidList:(inner.media!="img"?[[inner.name]]:[])
    })
  }else{
 Api.post({
  api:"pic/list",
  body:{folder: path},
  success:(data)=>{
        let tmpDir=[]
        let tmpImg=[]
        let tmpVid=[]
        let tmpGroupImg=[]
        let tmpGroupVid=[]
        setGlobal({
      select: {
        status:false,
        list: []
    }
});

        data.filelist.forEach((item) => {
            if(item[1]=="dir"||item[1]=="dir_link"){
                tmpDir.push(item[0])
            }
            else{
                    if(item[2]=="img"){
                        if(tmpGroupImg.length<12){
                            tmpGroupImg.push(item[0])
                        }
                        else{
                            tmpImg.push(tmpGroupImg)
                            tmpGroupImg=[]
                            tmpGroupImg.push(item[0])
                        }
                    }
                    if(item[2]=="vid"){
                        if(tmpGroupVid.length<12){
                            tmpGroupVid.push(item[0])
                        }
                        else{
                            tmpVid.push(tmpGroupVid)
                            tmpGroupVid=[]
                            tmpGroupVid.push(item[0])
                        }
                    }
            }
        })
       if(tmpGroupImg.length>0) tmpImg.push(tmpGroupImg)
       if(tmpGroupVid.length>0) tmpVid.push(tmpGroupVid)
      useGlobal.setState({
        dirList: tmpDir,
        imgList: tmpImg,
        vidList: tmpVid,
        nowPath: data.currentFolder,
        parentPath: data.parentFolder,
        selected: [],
        imgPage: showVideo ? false : true,
        pageNum:1
      });
  }
 })
}
}

// 加载页面
export function loadPage(isLoad){
  useGlobal.setState({
    loading: isLoad,
    showBg: isLoad,
  });
}
// 关闭mediawin
export function closeMediaWin(){
 useGlobal.setState({ mediaWin: { status: false } })
}
// 打开mediaWin
export function openMediaWin(url,type,index){
const setGlobal=useGlobal.setState
setGlobal({mediaWin:{
    url:url,
    img:type=="img"?true:false,
    status:true,
    index:index
}})

}
// 打开编辑窗口
export function openEditWin(url,index){
const setGlobal=useGlobal.setState
setGlobal({editWin:{
    url:url,
    status:true,
    index:index
}})
}
// 关闭编辑窗口
export function closeEditWin(){
  const editWin=useGlobal.getState().editWin
  useGlobal.setState({ editWin: {...editWin, status: false } })
}

// 上传文件
export function Upload(file, uploadData,edit=false) {
  if (file.size == 0) {
    notify.err(file.name + GetText("is_empty"));
    return;
  }

  let showVideo;
  const env=getEnv()
  const global = useGlobal.getState();
  const token = getToken();
  const nowPath = global.nowPath;
  const upload = global.upload;
  const inner=global.inner
  const setGlobal = useGlobal.setState;

  const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "ico", "apng", "avif"];
  const videoExts = ["mp4", "webm", "ogg", "ogv", "mov", "m4v", "avi", "3gp", "mkv"];
  const ext = file.name.split(".").pop().toLowerCase();

  if (imageExts.includes(ext)) {
    showVideo = false;
    setGlobal({ imgPage: true });
  } else if (videoExts.includes(ext)) {
    showVideo = true;
    setGlobal({ imgPage: false });
  } else {
    notify.err(file.name + ":" + GetText("not_support_type"));
    setGlobal({
      upload: { ...upload, status: false },
    });
    return;
  }

  const url = getUrl() + "pic/upload";
  const chunkSize = getChunkSize(file.size);
  const totalChunks = Math.ceil(file.size / chunkSize);
  let start = 0;

  function uploadChunk() {
    if (uploadData.sendSize >= uploadData.totalSize) {
      setGlobal({ upload: { ...upload, status: false } });
      notify.normal(GetText("op_com"));
      list(nowPath, showVideo);
      return;
    }

    if (start >= file.size) return;

    let percent = "";
    let tmp_send_size = 0;
    const chunk = file.slice(start, start + chunkSize);
    const curChunk = Math.floor(start / chunkSize);
    const formData = new FormData();
    formData.append("edit", edit);
    formData.append("file", chunk);
    formData.append("fileName", file.name);
    formData.append("totalChunks", totalChunks);
    formData.append("currentChunk", curChunk);
    formData.append("nowpath", (env.type!=""?dirName(inner.path):nowPath)); // 仅保留必要字段

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    // 将 user 和 token 移到 Header
    xhr.setRequestHeader("authorization", "Bearer " + token);
    xhr.setRequestHeader("source",env.type)
    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        uploadData.sendSize = uploadData.sendSize + Math.min(event.loaded, file.size) - tmp_send_size;
        tmp_send_size = event.loaded;
        percent = Math.floor((uploadData.sendSize / uploadData.totalSize) * 100) + "%";
        setGlobal({
          upload: { ...upload, percent: percent },
        });
      }
    };

    xhr.onload = function () {
      if (xhr.status !== 200) {
        if (xhr.status === 401) {
          notify.err(GetText("no_per"));
        } else {
          notify.err(GetText("error") + ":" + xhr.status + xhr.responseText);
        }
        setGlobal({ upload: { ...upload, status: false } });
        return;
      }

      start += chunkSize;
      uploadChunk();
    };

    xhr.onerror = function () {
      console.error(`Chunk ${curChunk + 1} upload encountered error.`);
      setGlobal({ upload: false });
    };

    xhr.send(formData);
  }

  uploadChunk();
}

// 获取块大小
function getChunkSize(fileSize) {
    const mb=1024*1024
    if (fileSize <= 1024 * mb) {
        return 10 * mb;
    } else if (fileSize <= 5120 * mb&&fileSize>1024 * mb) {
        return 50 * mb;
    } else {
        return 100 * mb;
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
      };
    const permitted = await UploadPermit();
    if (!permitted) {
      return;
    }
      fileList.forEach((file) => {
        Upload(file, uploadData); 
      });
    }
  }

  for (let i = 0; i < items.length; i++) {
    handleItem(items[i]);
  }
}
// 检查是否能有上传权限
export async function UploadPermit(){
  const upload = useGlobal.getState().upload;
if (await AsyncApi.post({
  api:"login/upload",
  body:{appType:"pic",fileType:""}
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