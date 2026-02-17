import { getNowPath } from "../store/CacheList"
import { getUrl } from "../store/request"
import { closeUpload, getFun, getSendSize, getTotalSize,  useUploadStore } from "../store/upload"
import { Api } from "./request"

export function Upload(msg) {
    const{
        files,
        apiUrl,
        success,
        fail
    }=msg
    useUploadStore.getState().setTotalSize(files)
    useUploadStore.getState().setUrl(apiUrl)
    useUploadStore.getState().setFun({success,fail})
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
    fd.append('relativePath',file.webkitRelativePath)
    fd.append('totalChunk',totalchunk)
    fd.append('index',index)
    fd.append('chunk',chunk)
   for (const [key, value] of fd.entries()) {
}
    Api.post({
        api:useUploadStore.getState().upload.apiUrl,
        body:fd,
        contentType:"multipart/form-data",
        success:(data)=>{
            if(data.fileItem.length!=0)
                useUploadStore.getState().addFileList(data.fileItem)
            useUploadStore.getState().setSendSize(chunk.size)
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