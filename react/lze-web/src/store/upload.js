import { create } from "zustand";

export const useUploadStore = create((set, get) => ({
  upload: {
    totalSize: 0,
    sendSize: 0,
    percent: 0
  },

  // 设置总大小
  setTotalSize: (size) => {
    const { upload } = get();
    const percent = upload.sendSize === 0
      ? 0
      : Math.floor(sendSize / totalSize * 100);

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
      : Math.floor(sendSize / totalSize * 100);

    set({
      upload: {
        ...upload,
        sendSize: size,
        percent
      }
    });
  }
}));
// setter
export const setTotalSize= (files) => {
  let total = 0;

  for (const file of files) {
    total += file.size; // 字节
  }

  const { upload } = get();

  const percent = upload.sendSize === 0
    ? 0
    : Math.min(100, Math.floor(upload.sendSize / total * 100));

  set({
    upload: {
      ...upload,
      totalSize: total,
      percent
    }
  });
}
export const setSendSize = (size) =>
  useUploadStore.getState().setSendSize(size);

// getter
export const getUpload = () =>
  useUploadStore.getState().upload;
export const getSendSize=()=>
    useUploadStore.getState.sendSize
export const getTotalSize=()=>
    useUploadStore.getState().totalSize
export const getPercent = () =>
  useUploadStore.getState().upload.percent;