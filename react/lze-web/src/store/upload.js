import { create } from "zustand";

export const useUploadStore = create((set, get) => ({
  upload: {
    totalSize: 0,
    sendSize: 0,
    percent: 0,
    fileList: []
  },

  // 添加文件到 fileList
  addFileList: (files) => {
    const { upload } = get();
    const newFileList = [...upload.fileList, ...files];
    set({
      upload: {
        ...upload,
        fileList: newFileList
      }
    });
  },

  // 获取 fileList
  getFileList: () => {
    const { upload } = get();
    return upload.fileList;
  },

  // 设置总大小
  setTotalSize: (size) => {
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
    const percent = upload.totalSize === 0
      ? 0
      : Math.floor(size / upload.totalSize * 100);

    set({
      upload: {
        ...upload,
        sendSize: size,
        percent
      }
    });
  }
}));

// 全局 getter 和 setter
export const getUpload = () => useUploadStore.getState().upload;
export const getFileList = () => useUploadStore.getState().getFileList();
export const getSendSize = () => useUploadStore.getState().upload.sendSize;
export const getTotalSize = () => useUploadStore.getState().upload.totalSize;
export const getPercent = () => useUploadStore.getState().upload.percent;
export const setSendSize = (size) => useUploadStore.getState().setSendSize(size);
export const setTotalSize = (files) => {
  let total = 0;
  for (const file of files) {
    total += file.size; // 字节
  }
  useUploadStore.getState().setTotalSize(total);
};