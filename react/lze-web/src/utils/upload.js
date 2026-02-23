import { getNowPath } from "../store/CacheList"
import { getUrl } from "../store/request"
import { closeUpload, getUploadFileList, getFun, getPercent, getSendSize, getTotalSize,  openUpload,  useUploadStore } from "../store/upload"
import { Api, AsyncApi } from "./request"

export async function Upload(msg) {
    useUploadStore.getState().init()
    openUpload()
    const{
        files,
        apiUrl,
        success,
        fail
    }=msg
    useUploadStore.getState().setTotal(files)
    useUploadStore.getState().setUrl(apiUrl)
    useUploadStore.getState().setFun({success,fail})
    const uploadToken=await getUploadToken()
    if(uploadToken=="")return
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
        setProgress:(sendSize)=>{useUploadStore.getState().setSendSize(sendSize)},
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