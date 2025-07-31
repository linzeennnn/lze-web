import { useState } from "react"
import {useGlobal,list,loadPage, GetText} from '../global'; 
import { notify } from '../../../components/notify';
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
              NewDir(newName)} }  >
            </button> 
            </>
    )
 }

 // 创建新目录
export function NewDir(folderName) {
  if (folderName.includes('/') || folderName.includes('\\')) {
    notify(GetText("name_not_con")+' / \\');
    return;
  } else if (folderName.length === 0) {
    notify(GetText("folder_name")+GetText("is_empty"));
    return;
  }

  const global = useGlobal.getState();

  const sendData = {
    folderName,
    nowpath: global.nowPath
  };

  loadPage(true)

  fetch(`${global.docUrl}new_folder`, {
    method: 'POST',
    body: JSON.stringify(sendData),
    headers: {
      'Content-Type': 'application/json',
            'authorization':"Bearer " +global.token,
            'x-user':global.userName
    },
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 401) {
          notify(GetText("no_per"));
        } else {
          notify(GetText("error")+":"+res.status);
        }

        loadPage(false)
        return;
      }

      notify(GetText("op_com"));
      list(global.nowPath); // 重新加载列表
    });
}
