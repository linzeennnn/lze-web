import { create } from 'zustand';
import { notify } from '../public/notify';
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
  pageNum:1,
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
// 扫描目录
export function list(path) {
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
            if(item.type=="dir"||item.type=="dir_link"){
                tmpDir.push(item.name)
            }
            else{
                if(item.type=="file"||item.type=="file_link"){
                    if(item.media=="img"){
                        if(tmpGroupImg.length<12){
                            tmpGroupImg.push(item.name)
                        }
                        else{
                            tmpImg.push(tmpGroupImg)
                            tmpGroupImg=[]
                            tmpGroupImg.push(item.name)
                        }
                    }
                    if(item.media=="vid"){
                        if(tmpGroupVid.length<12){
                            tmpGroupVid.push(item.name)
                        }
                        else{
                            tmpVid.push(tmpGroupVid)
                            tmpGroupVid=[]
                            tmpGroupVid.push(item.name)
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
        imgPage: true,
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
    notify(file.name + " 是空文件，无法上传");
    return;
  }
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
    setGlobal({
      imgPage: true
    });
  } else if (videoExts.includes(ext)) {
    setGlobal({
      imgPage: false
    });
  } 
  else {
    notify(file.name + ":不支持类型")
    setGlobal({
      upload:{
          ...upload,
          status: false,
      }
    });
    return; 
  }
  const url = global.picUrl + "upload";

  const chunkSize = getChunkSize(file.size);
  const totalChunks = Math.ceil(file.size / chunkSize);
  let start = 0;

  function uploadChunk() {
    if (uploadData.sendSize >= uploadData.totalSize) {
      setGlobal({
        upload: {
          ...upload,
          status: false,
        },
      });

      notify("上传完成");
      list(nowPath);
      return;
    }

    if (start >= file.size) return;

    const chunk = file.slice(start, start + chunkSize);
    const curChunk = Math.floor(start / chunkSize);
    const formData = new FormData();

    formData.append("file", chunk);
    formData.append("fileName", file.name);
    formData.append("totalChunks", totalChunks);
    formData.append("currentChunk", curChunk);
    formData.append("user", user);
    formData.append("token", token);
    formData.append("nowpath", nowPath);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        const uploadingData = {
          loaded: event.loaded,
          fileSize: file.size,
          totalChunk: totalChunks,
          curChunk: curChunk,
          chunkSize: chunkSize,
        };
        const percent = Math.floor(count_percent(uploadingData, uploadData)) + "%";
        setGlobal({
          upload: {
            ...upload,
            percent: percent,
          },
        });
      }
    };

    xhr.onload = function () {
      if (xhr.status !== 200) {
        if (xhr.status === 401) {
          notify("无上传权限");
        } else {
          notify("上传失败：" + xhr.status + " 错误:"+ xhr.responseText);
        }
        setGlobal({
          upload: {
            ...upload,
            status: false,
          },
        });
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


// 计算百分比
function count_percent(uploadindData,data){
    let remain_size=uploadindData.fileSize-(uploadindData.totalChunk-1)* uploadindData.chunkSize
    if(uploadindData.curChunk==uploadindData.totalChunk-1){//判断是否上传到最后一块
      if(uploadindData.loaded>=remain_size){//判断当前块是否上传完
        
        data.sendSize+=uploadindData.loaded
        return data.sendSize/data.totalSize *100
      }
      else
        return (data.sendSize+uploadindData.loaded)/data.totalSize *100
    }
    else{
      if(uploadindData.loaded>=uploadindData.chunkSize){//判断当前块是否上传完
        data.sendSize+=uploadindData.loaded
        return data.sendSize/data.totalSize *100
      }
      else
        return (data.sendSize+uploadindData.loaded)/data.totalSize *100
      
    }
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
      notify("不支持上传文件夹");
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
        notify("没有可上传的文件");
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
