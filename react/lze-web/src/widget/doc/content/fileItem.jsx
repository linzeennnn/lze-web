import FileText from "./fileText"
import EditBtn from "./editBtn"
import DownloadBtn from "./downloadBtn"
import Link from "./link"
import { useState } from "react";
import { useGlobal,list } from "../global";
import { Api } from "../../../utils/request";
export default function FileItem({ fileMes, selected, docClick}){
    const [editMode, setEditMode] = useState(false);
    const[nameInput,setNameInput]=useState(fileMes[0])
      const nowPath=useGlobal.getState().nowPath
      const path=nowPath+"/"+fileMes[0]
    return(
        <div
            className={"doc-list main-item "+
                (selected.includes(path) ? "doc-list-selected " :"")+
                ((fileMes[1] === "dir" || fileMes[1] === "dir_link") ?"dir-item ":"file-item ")
            }
            onClick={() => docClick(path)}
            key={"doclist" + fileMes[0]}
            >
            <FileText fileMes={fileMes} editing={[editMode, setEditMode]} 
            nameEdit={[nameInput,setNameInput]} rename={rename}/>
            <EditBtn name={fileMes[0]} editing={[editMode, setEditMode]} 
            newName={nameInput} rename={rename}/>
            <DownloadBtn fileMes={fileMes}/>
            {(fileMes[1] === "dir" || fileMes[1] === "dir_link") ?null:<Link name={fileMes[0]}></Link>}
        </div>
    )
}
function rename(oldname,newname){
    if(oldname==newname){
        return
    }
    const global=useGlobal.getState()
    const oldpath=global.nowPath+"/"+oldname
    const newpath=global.nowPath+"/"+newname
Api.post({
    api:"doc/rename",
    body:{oldpath,newpath},
    notice:true,
    success:()=>{list(global.nowPath)}
})
}