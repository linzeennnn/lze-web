import { create } from 'zustand';
import { notify } from '../../components/notify';
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
  dragWin:false,
  langList:[],
  fileWin:{
    status:false,
    url:"",
    view:false
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
  docUrl:`${window.location.origin}/server/doc/`,
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
PageCom(useGlobal.setState,"doc")
  list("")
}
// 扫描目录
export function list(path) {
  const sendData = { file: path };
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
      if(data.type=="dir"){
      useGlobal.setState({
        fileList: data.filelist,
        nowPath: data.currentFolder,
        parentPath: data.parentFolder,
        selected: [],
      });}
      if(data.type=="file"){
        useGlobal.setState({
          fileWin:{
            status:true,
            url:data.url,
            view:data.view
          }
        })
      }
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
    notify(GetText("error") + ":" + file.name + GetText("is_empty"));
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
        notify(GetText("op_com"));
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
    xhr.setRequestHeader("x-user", user);
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
          notify(GetText("no_per"));
        } else {
          notify(GetText("error") + ":" + xhr.status);
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
        notify(GetText("op_com"));
        list(global.nowPath)
    })
    .catch(error => {
        notify(error);
    });
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
