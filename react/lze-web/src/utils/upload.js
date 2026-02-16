import { getSendSize, getTotalSize, setTotalSize } from "../store/upload"

export function Upload(msg) {
    const{
        files,
        type,
        apiUrl,
        success,
        fail
    }=msg
setTotalSize(files)

}
function sendFile(file){

}
function sendChunk(chunk){

}
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
function getChunkSize(file){
    const MB=1024*1024
    return Math.min(10*MB, Math.max(2*MB, file.size / (100*MB)))
}
function isFinsh(){
    return (getSendSize()>=getTotalSize())
}