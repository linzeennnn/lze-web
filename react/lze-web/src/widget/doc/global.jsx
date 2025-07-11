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
  dragWin:false,
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
// 压缩目录
export function ZipDir(fileName){
  loadPage(true)
  const global = useGlobal.getState();
  const token =global.token
  const user = global.userName
        fetch(global.docUrl+"zip_folder",{
        method: "POST",
        headers: {
        "Content-Type": "application/json" 
    },
    body: JSON.stringify({ folder_path: global.nowPath+fileName ,token,user}) 
      })
      .then(response => {
        if (response.status === 401) {
          notify("无下载文件夹权限")
          pageloading(0)
          throw new Error('未授权访问');
        }
        return response.text();  
      })
      .then(text => {
      window.location.href = global.docUrl+"down_zip?downToken="+text
      notify("开始下载,请在10秒内下载")
     loadPage(false)
    })
    }

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

// 上传文件
export function Upload(file, uploadData, type) {
  if (file.size == 0) {
    notify(file.name + "是空文件,无法上传");
    return;
  }

  const global = useGlobal.getState();
  const user = global.userName;
  const token = global.token;
  const nowPath = global.nowPath;
  const upload = global.upload;
  const setGlobal = useGlobal.setState;

  const url =
    type === "file"
      ? global.docUrl + "upload_file"
      : global.docUrl + "upload_folder";

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

      if (type === "file") {
        notify("上传完成");
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

    const chunk = file.slice(start, start + chunkSize);
    const curChunk = Math.floor(start / chunkSize);
    const formData = new FormData();

    formData.append("file", chunk);
    formData.append("fileName", file.name);
    formData.append("totalChunks", totalChunks);
    formData.append("currentChunk", curChunk);
    formData.append("user", user);
    formData.append("token", token);

    if (type === "dir") {
      const relativePath = file.webkitRelativePath;
      formData.append("relativePath", relativePath);
    }

    if (type === "file") {
      formData.append("nowpath", nowPath);
    }

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
        let percent =
          Math.floor(count_percent(uploadingData, uploadData)) + "%";
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
          notify("无上传权限");
        } else {
          notify("上传失败:" + xhr.status + "错误");
        }
        setGlobal({
          upload: {
            ...upload,
            status: false,
          },
        });
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
  const url=global.docUrl+"move_folder"
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: foldername,
            path: global.nowPath
        })
    })
    .then(response => response.text())
    .then(data => {
        notify("上传完成");
        list(global.nowPath)
    })
    .catch(error => {
        notify(error);
    });
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
        const type = file.webkitRelativePath ? "dir" : "file";
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
