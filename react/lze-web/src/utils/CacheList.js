import { getFileCache, getFileListCurrent, setFileCache } from "../store/CacheList"

// 为缓存增加内容
export function AddCacheList(listMsg){
  const Cache=structuredClone(getFileCache())
  if (Cache.current!=-1&&Cache.nowPath[Cache.current]==listMsg.nowPath){
    const newFileList=Cache.fileList
    const newNowPath=Cache.nowPath
    const newName=Cache.name
    newFileList[Cache.current]=listMsg.fileList
    newNowPath[Cache.current]=listMsg.nowPath
    newName[Cache.current]=listMsg.name
    setFileCache( {
         fileList:newFileList,
         nowPath:newNowPath,
         name:newName,
          current:Cache.current
      } 
    )
    
    return
  }
  setFileCache( {
       fileList:(Cache.current==-1)?[listMsg.fileList]:Cache.fileList.concat([listMsg.fileList]),
       nowPath:(Cache.current==-1)?[listMsg.nowPath]:Cache.nowPath.concat(listMsg.nowPath),
       name:(Cache.current==-1)?[listMsg.name]:Cache.name.concat(listMsg.name),
       current:Cache.current+1
    } 
  )

}
// 使用缓存扫描目录
export function LocalList(index){
  
  const Cache=structuredClone(getFileCache())
      const newFileList=Cache.fileList
      const newNowPath=Cache.nowPath
      const newName=Cache.name
      newFileList.length=index+1
      newNowPath.length=index+1
      newName.length=index+1
     setFileCache({
           fileList:newFileList,
          nowPath:newNowPath,
          name:newName,
            current:index
        } 
      )
      
}