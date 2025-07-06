import { useState } from "react"
import { NewDir } from "./docFun"
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