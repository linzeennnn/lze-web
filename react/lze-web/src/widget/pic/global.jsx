import { create } from 'zustand';
import { notify } from '../../components/notify';
import { PageCom } from '../../components/pageCom';
// 全局变量
export const useGlobal = create((set, get) => ({
  userName: window.localStorage.getItem('userName'),
  token: window.localStorage.getItem('token'),
  nowPath: "",
  parentPath: "",
  imgList: [],
  vidList: [],
  dirList: [],
  uploading: false,
  showBg: false,
  langList:[],
  pageNum:1,
    theme:{
      mode:"",
      color:{
        pic:""
      },
      userSelect:""
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
  upload:{
    status:false,
    percent:"0%"
  },
  picUrl:`${window.location.origin}/server/pic/`,
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
PageCom(useGlobal.setState,"pic")
  list("")
}
// 扫描目录
export function list(path,showVideo) {
  const sendData = { folder: path };
  const url = useGlobal.getState().picUrl+"list";

  loadPage(true)

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(sendData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
        let tmpDir=[]
        let tmpImg=[]
        let tmpVid=[]
        let tmpGroupImg=[]
        let tmpGroupVid=[]
        data.filelist.forEach((item) => {
            if(item[1]=="dir"||item[1]=="dir_link"){
                tmpDir.push(item[0])
            }
            else{
                if(item[1]=="file"||item[1]=="file_link"){
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
      });
      loadPage(false)
    });
}

// 加载页面
export function loadPage(isLoad){
  useGlobal.setState({
    loading: isLoad,
    showBg: isLoad
  });
}
// 上传文件
export function Upload(file, uploadData) {
  if (file.size == 0) {
    notify(file.name + GetText("is_empty"));
    return;
  }

  let showVideo;
  const global = useGlobal.getState();
  const user = global.userName;
  const token = global.token;
  const nowPath = global.nowPath;
  const upload = global.upload;
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
    notify(file.name + ":" + GetText("not_support_type"));
    setGlobal({
      upload: { ...upload, status: false },
    });
    return;
  }

  const url = global.picUrl + "upload";
  const chunkSize = getChunkSize(file.size);
  const totalChunks = Math.ceil(file.size / chunkSize);
  let start = 0;

  function uploadChunk() {
    if (uploadData.sendSize >= uploadData.totalSize) {
      setGlobal({ upload: { ...upload, status: false } });
      notify(GetText("op_com"));
      list(nowPath, showVideo);
      return;
    }

    if (start >= file.size) return;

    let percent = "";
    let tmp_send_size = 0;
    const chunk = file.slice(start, start + chunkSize);
    const curChunk = Math.floor(start / chunkSize);
    const formData = new FormData();

    formData.append("file", chunk);
    formData.append("fileName", file.name);
    formData.append("totalChunks", totalChunks);
    formData.append("currentChunk", curChunk);
    formData.append("nowpath", nowPath); // 仅保留必要字段

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    // 将 user 和 token 移到 Header
    xhr.setRequestHeader("authorization", "Bearer " + token);
    xhr.setRequestHeader("x-user", user);

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
          notify(GetText("no_per"));
        } else {
          notify(GetText("error") + ":" + xhr.status + xhr.responseText);
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
      notify(GetText("not_support_type"));
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

  function maybeUpload() {
    if (pending === 0) {
      if (fileList.length === 0) {
        notify(GetText("empty"));
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

      fileList.forEach((file) => {
        Upload(file, uploadData); // type 参数已从 Upload 中移除
      });
    }
  }

  for (let i = 0; i < items.length; i++) {
    handleItem(items[i]);
  }
}
