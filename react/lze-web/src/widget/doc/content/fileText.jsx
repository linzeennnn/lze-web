import {list,useGlobal} from '../global'
import { useState } from "react";
export default function FileText({fileMes,editMode,nameEdit,rename}){
    const[nameInput,setNameInput]=nameEdit
    const nowPath = useGlobal((state) => state.nowPath);
      const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          rename(fileMes.name, nameInput);
        }
      };
    
    return(
        <>
        {editMode?
        (<input value={nameInput} className="file-list-text file-list-input" 
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={handleKeyDown} 
            />):
        (<span
            className={(fileMes.type === "dir" || fileMes.type === "dir_link" ? "dir-text" : "file-text") + " file-list-text"}
            title={"查看" + fileMes.name}
            onClick={(e) => {
                e.stopPropagation();

                if (fileMes.type === "dir" || fileMes.type === "dir_link") {
                const dir_path = nowPath + "/" + fileMes.name;
                list(dir_path);
                }

                if (fileMes.type === "file" || fileMes.type === "file_link") {
                const file_path =  nowPath + "/" + fileMes.name;
                window.location.href = window.location.origin + "/file/Documents" + file_path;
                }
            }}
            >
            {fileMes.name}
            </span>)
        }
        </>
    )
}