import { create } from "zustand";
import { setToken, setUrl } from "./request";

export const useUploadStore = create((set, get) => ({
  upload: {
        apiList:{
          file:"",
          dir:""
        },
        drag:false,
        token:"",
        files:null,
        fun:{
          success:()=>{},
          fail:()=>{},
          end:()=>{}
        }
  },
  init:()=>{
    const { upload } = get();
    set({
      upload: {
        ...upload,
        totalSize: 0,
        totalFile:0,
        sendSize: 0,
        percent: 0,
        fileList: [],
        status:true,
        apiUrl:"",
        status:false,
      }
    });
  },
  // 添加文件到 fileList
  addFileList: (fileItem) => {
    if(!fileItem[0]&&!fileItem[1]) return;
    const { upload } = get();
    const newFileList = [...upload.fileList, fileItem];
    set({
      upload: {
        ...upload,
        fileList: newFileList
      }
    });
  },
  setUrl:()=>{
    const { upload } = get();
    const type=fileListType(upload.files)
    set({
      upload: {
        ...upload,
        apiUrl: upload.apiList[type]
      }
    });
  },
setUploadMsg: (msg = {}) => {
  const { upload } = get();

  set({
    upload: {
      ...upload,
      fun: {
        success: msg.success ?? (() => {}),
        fail: msg.fail ?? (() => {}),
        end: msg.end ?? (() => {})
      },
      apiList: {
        file: msg.apiList[0] ?? upload.apiList?.file,
        dir: msg.apiList[1] ?? upload.apiList?.dir
      }
    }
  });
},
setFiles:(files)=>{
  const { upload } = get();
  set({
    upload: {
      ...upload,
      files: files
    }
  });
},
  setToken:(token)=>{
    const { upload } = get();
     set({
      upload: {
        ...upload,
        token:token
      }
    });
  },
  // 获取 fileList
  getUploadFileList: () => {
    const { upload } = get();
    return upload.fileList;
  },
  setStatus:(status)=>{
    const { upload } = get();
    set({
      upload: {
        ...upload,
        status: status
      }
    });
  },
  setDrag:(drag)=>{
    const { upload } = get();
    set({
      upload: {
        ...upload,
        drag: drag
      }
    });
  },
  // 设置总大小
  setTotal: (files) => {
    let size=0
    for(const file of files){
      size+=file.size
    }
    const { upload } = get();
    const percent = upload.sendSize === 0
      ? 0
      : Math.floor(upload.sendSize / size * 100);

    set({
      upload: {
        ...upload,
        totalSize: size,
        totalFile:files.length,
        percent
      }
    });
  },

  // 设置已发送大小（自动计算 percent）
setSendSize: (size) => {
  const { upload } = get();
  const newSendSize = upload.sendSize + size;

  let percent = upload.totalSize === 0
    ? 0
    : Math.floor(newSendSize / upload.totalSize * 100);

  // 限制最大 100
  if (percent > 100) percent = 100;

  set({
    upload: {
      ...upload,
      sendSize: newSendSize,
      percent
    }
  });
}
}));

// 全局 getter 和 setter
export function closeUpload(){
  useUploadStore.getState().setStatus(false)
}
export function openUpload(){
  useUploadStore.getState().setStatus(true)
}
export const getUpload = () => useUploadStore.getState().upload;
export const getUploadFileList = () => useUploadStore.getState().getUploadFileList();
export const getSendSize = () => useUploadStore.getState().upload.sendSize;
export const getTotalSize = () => useUploadStore.getState().upload.totalSize;
export const getApiUrl=()=>useUploadStore.getState().upload.apiUrl;
export const getPercent = () => useUploadStore.getState().upload.percent;
export const getFun = () => useUploadStore.getState().upload.fun;
export const setSendSize = (size) => useUploadStore.getState().setSendSize(size);
export const setTotalSize = (files) => {
  let total = 0;
  for (const file of files) {
    total += file.size; // 字节
  }
  useUploadStore.getState().setTotalSize(total);
};

// 获取文件列表类型
function fileListType(files) {
  if (!files || files.length === 0) return null;

  for (const file of files) {
    if (file.webkitRelativePath && file.webkitRelativePath.includes("/")) {
      return "dir";
    }
  }

  return "file";
}