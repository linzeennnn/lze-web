import { create } from "zustand";
import { setUrl } from "./request";

export const useUploadStore = create((set, get) => ({
  upload: {
    totalSize: 0,
    sendSize: 0,
    percent: 0,
    fileList: [],//每个文件上传完成后的fileList,
    apiUrl:"",
    status:false,
    fun:{
    success:()=>{},
    fail:()=>{}
    }
  },

  // 添加文件到 fileList
  addFileList: (fileItem) => {
    const { upload } = get();
    const newFileList = [...upload.fileList, ...fileItem];
    set({
      upload: {
        ...upload,
        fileList: newFileList
      }
    });
  },
  
  setFun:(fun)=>{
    const { upload } = get();
    set({
      upload: {
        ...upload,
        fun: fun
      }
    });
  },
  setUrl:(url)=>{
    const { upload } = get();
    
    set({
      upload: {
        ...upload,
        apiUrl: url
      }
    });
  },
  // 获取 fileList
  getFileList: () => {
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
  // 设置总大小
  setTotalSize: (files) => {
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
        percent
      }
    });
  },

  // 设置已发送大小（自动计算 percent）
  setSendSize: (size) => {
  const { upload } = get();
  const newSendSize = upload.sendSize + size;

  const percent = upload.totalSize === 0
    ? 0
    : Math.floor(newSendSize / upload.totalSize * 100);

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
export const getFileList = () => useUploadStore.getState().getFileList();
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