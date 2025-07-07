import { useState } from "react"
import {useGlobal,list} from '../global'; 
import { notify } from '../../public/notify';
export default function NewDirInput(props) {
    const[newName,setNewName]=useState("")
     const nameChange = (e) => {
    const { value } = e.target;
    setNewName(value)
  };
   const newDirKeyDown = (e) => {
      if (e.key === 'Enter') {
        NewDir(newName)
      }
    };
    return(
        <>
        <input placeholder="输入文件夹名称" id="new-dir-input"
        onChange={nameChange} value={newName} onKeyDown={newDirKeyDown}
        >
        </input >
            <button id="new-dir-save" className="btn" 
            title="保存" onClick={()=>{NewDir(newName)} }  >
            </button> 
            </>
    )
 }

 // 创建新目录
export function NewDir(folderName) {
  if (folderName.includes('/') || folderName.includes('\\')) {
    notify('文件夹名不能包含/或\\');
    return;
  } else if (folderName.length === 0) {
    notify('文件夹名不能为空');
    return;
  }

  const global = useGlobal.getState();

  const sendData = {
    folderName,
    nowpath: global.nowPath,
    user: global.userName,
    token: global.token,
  };

  useGlobal.setState({
    loading: true,
    showBg: true,
    creating: false
  });

  fetch(`${global.docUrl}new_folder`, {
    method: 'POST',
    body: JSON.stringify(sendData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 401) {
          notify('无创建文件夹权限');
        } else {
          notify(res.status + ' 错误');
        }

        useGlobal.setState({ creating: false,
        loading: false,
        showBg: false,

         });
        return;
      }

      notify('已创建 [' + folderName + ']');
      list(global.nowPath); // 重新加载列表
    });
}
