import { getNowPath } from "../store/CacheList"
import { getUrl } from "../store/request"
import { closeUpload, getUploadFileList, getFun, getPercent, getSendSize, getTotalSize,  openUpload,  useUploadStore } from "../store/upload"
import { Api, AsyncApi } from "./request"

export async function Upload(files) {
    useUploadStore.getState().init()
    openUpload()
    useUploadStore.getState().setFiles(files)  
    useUploadStore.getState().setUrl()
    useUploadStore.getState().setTotal(files) 
    const uploadToken=await getUploadToken()
    if(!uploadToken){
        closeUpload()
        return}
    useUploadStore.getState().setToken(uploadToken)
    for(const file of files){
        sendFile(file)
    }

}
//发送文件
function sendFile(file){
    const chunks=getChunk(file)
    const totalChunk=chunks.length
    chunks.forEach((chunk,index)=>{
        sendChunk(chunk,file,totalChunk,index)
    })
}
// 发送分块
function sendChunk(chunk,file,totalchunk,index){
    const fd = new FormData();
    fd.append('filename',file.name)
    fd.append('nowPath',getNowPath())
    fd.append('totalFile',useUploadStore.getState().upload.totalFile)
    fd.append('uploadToken',useUploadStore.getState().upload.token)
    fd.append('relativePath',file.webkitRelativePath)
    fd.append('totalChunk',totalchunk)
    fd.append('index',index)
    fd.append('chunk',chunk)
   for (const [key, value] of fd.entries()) {
}
    Api.upload({
        api:useUploadStore.getState().upload.apiUrl,
        body:fd,
        loading:false,
        setProgress:(percent)=>{useUploadStore.getState().setSendSize(percent*chunk.size)},
        notice:true,
        contentType:"multipart/form-data",
        success:(data)=>{
            useUploadStore.getState().setSendSize(chunk.size)
            useUploadStore.getState().addFileList(data.fileItem)
            if(isFinsh()){
                getFun().success(data)
                closeUpload()
            }
        }
    })

}
// 获取分块
function getChunk(file){
    const chunks = [];
    let start = 0;
    const chunkSize=getChunkSize(file)
  while (start < file.size) {
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    chunks.push(chunk);
    start = end;
  }

  return chunks;
}
// 获取分块大小
function getChunkSize(file){
    const MB=1024*1024
    return Math.min(10*MB, Math.max(2*MB, file.size / (100*MB)))
}
// 判断是否结束
function isFinsh(){
    return (getSendSize()>=getTotalSize())
}
// 获取上传的token
async function getUploadToken(){
   const data=await AsyncApi.post({
    api:"login/upload",
    body:{action:useUploadStore.getState().upload.apiUrl}
   })
   return data
}
//拖拽上传
export function DragOver(e) {
    useUploadStore.getState().setDrag(true)
  e.preventDefault();
}

export function DragLeave(e) {
  useUploadStore.getState().setDrag(false)
  e.preventDefault();
}
export async function Drop(e) {
  useUploadStore.getState().setDrag(false)
  e.preventDefault();
  e.stopPropagation();

  const items = e.dataTransfer.items;
  const files = await getFilesFromItems(items);

  if (files.length === 0) return;

  Upload(files);
}
function getFilesFromItems(items) {
  return new Promise((resolve) => {
    const fileList = [];
    let pending = items.length;

    if (!pending) resolve([]);

    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry();
      if (entry) {
        traverseFileTree(entry, "", fileList, () => {
          pending--;
          if (!pending) resolve(fileList);
        });
      } else {
        pending--;
        if (!pending) resolve(fileList);
      }
    }
  });
}
function traverseFileTree(entry, path = "", fileList, done) {
  if (entry.isFile) {
    entry.file((file) => {
      // 关键：模拟 input webkitdirectory 的效果
      Object.defineProperty(file, "webkitRelativePath", {
        value: path + file.name
      });

      fileList.push(file);
      done();
    });
  } 
  else if (entry.isDirectory) {
    const dirReader = entry.createReader();
    dirReader.readEntries((entries) => {
      let count = entries.length;

      if (!count) {
        done();
        return;
      }

      entries.forEach((ent) => {
        traverseFileTree(
          ent,
          path + entry.name + "/",
          fileList,
          () => {
            count--;
            if (!count) done();
          }
        );
      });
    });
  }
}