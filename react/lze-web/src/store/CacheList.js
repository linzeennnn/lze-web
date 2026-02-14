import { create } from "zustand";

export const useFileCacheStore = create((set) => ({
  fileCache:{
    fileList:[],
    name:[],
    nowPath:[],
    current:-1
  },
  set: (obj) => {
    set({ fileCache:obj  });
  }
}));
export const setFileCache = (obj) => useFileCacheStore.getState().set(obj)
export const getFileCache = () => useFileCacheStore.getState().fileCache;
export const getNowPath=()=>{
 return chacheGetter('nowPath')
}
export const getFileList=()=>{
  return  chacheGetter('fileList')
}
export const getName=()=>{
  return  chacheGetter('name')
}
function chacheGetter(key){
  const current = getFileCache().current
  return getFileCache()[key][current]
}