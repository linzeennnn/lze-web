import { useState } from "react"
import {useGlobal,list,loadPage, fileBuffer} from '../global'; 
import { GetText } from '../../../utils/common';

import { notify } from "../../../utils/common";
import { Api } from "../../../utils/request";
import { Icon } from "../../../utils/icon";
import { getFileCache, getNowPath, setFileCache } from "../../../store/CacheList";
export default function NewDirInput({setCreate}) {
    const[newName,setNewName]=useState("")
     const nameChange = (e) => {
    const { value } = e.target;
    setNewName(value)
  };
   const newDirKeyDown = (e) => {
      if (e.key === 'Enter') {
      setCreate(false)
        NewDir(newName)
      }
    };
    return(
        <>
        <input placeholder={GetText("folder_name")} id="new-dir-input"
        onChange={nameChange} value={newName} onKeyDown={newDirKeyDown}
        >
        </input >
            <button id="new-dir-save" className="btn" 
            title={GetText("save")} onClick={()=>{
              setCreate(false)
              NewDir(newName)} }  >{Icon("save")}
            </button> 
            </>
    )
 }

 // 创建新目录
export function NewDir(folderName) {
  if (folderName.includes('/') || folderName.includes('\\')) {
    notify.err(GetText("name_not_con")+' / \\');
    return;
  } else if (folderName.length === 0) {
    notify.err(GetText("folder_name")+GetText("is_empty"));
    return;
  }
  const global = useGlobal.getState();
  Api.post({
    api:"doc/new_folder",
    notice:true,
    body:{
     folderName,
    nowpath: getNowPath()     
    },
    success:(data)=>{
          const cache=structuredClone(getFileCache())
          const tmpFileList=cache.fileList
          const newFileList=[data.fileItem].concat(cache.fileList[cache.current])
          tmpFileList[cache.current]=newFileList
          setFileCache({...cache,fileList:tmpFileList})
    }
  })
}
