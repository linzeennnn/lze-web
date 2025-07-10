import { create } from 'zustand';
import { notify } from '../public/notify';
// 全局变量
export const useGlobal = create((set, get) => ({
  userName: window.localStorage.getItem('userName'),
  token: window.localStorage.getItem('token'),
  nowPath: '/',
  parentPath: '/',
  fileList: [],
  uploading: false,
  showBg: false,
  loading: false,
  upload:{
    win:false,
    status:false,
    percent:"0%"
  },
  selected: [],
  docUrl:`${window.location.origin}/server/doc/`,
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
  const url = useGlobal.getState().docUrl;

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
      useGlobal.setState({
        fileList: data.filelist,
        nowPath: data.currentFolder,
        parentPath: data.parentFolder,
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


export function Upload(file,uploadData) {
  const global = useGlobal.getState();
  const user = global.userName;
  const token = global.token;
  const url = global.docUrl + "upload_file";
  const nowPath = global.nowPath;
  const upload = global.upload;
  const setGlobal = useGlobal.setState;

  const chunkSize = getChunkSize(file.size);
  const totalChunks = Math.ceil(file.size / chunkSize);
  let start = 0;

  function uploadChunk() {
    if(uploadData.sendSize>=uploadData.totalSize){
        setGlobal({upload:{
          ...upload,
          status:false
        }})
        notify("上传完成")
        list(nowPath)
      return;
    }
    if (start >= file.size) {
      return;
    }

    const chunk = file.slice(start, start + chunkSize);
    const curChunk = Math.floor(start / chunkSize);

    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("fileName", file.name);
    formData.append("totalChunks", totalChunks);
    formData.append("currentChunk", curChunk); // 从 0 开始
    formData.append("user", user);
    formData.append("token", token);
    formData.append("nowpath", nowPath);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        const uploadingData={
          loaded: event.loaded,
          fileSize: file.size,
          totalChunk: totalChunks,
          curChunk: curChunk,
          chunkSize: chunkSize,
        }
        let percent=Math.floor(count_percent(uploadingData,uploadData))+"%"
        setGlobal({upload:{
          ...upload,
          percent:percent
        }})
        
      }
    };
    xhr.onload = function () {
      if (xhr.status != 200) {
        if(xhr.status==401){
          notify("无上传权限")
        }
        else{
          notify("上传失败:"+xhr.status+"错误")
        }
        setGlobal({upload:{
          ...upload,
          status:false
        }})
        return
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