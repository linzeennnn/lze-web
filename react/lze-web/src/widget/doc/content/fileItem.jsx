import FileText from "./fileText"
import EditBtn from "./editBtn"
import DownloadBtn from "./downloadBtn"
import { useState } from "react";
import { useGlobal,list,loadPage, GetText } from "../global";
import { notify } from "../../../components/notify";
export default function FileItem({ fileMes, selected, docClick}){
    const [editMode, setEditMode] = useState(false);
    const[nameInput,setNameInput]=useState(fileMes[0])
      const nowPath=useGlobal.getState().nowPath
      const path=nowPath+"/"+fileMes[0]
    return(
        <div
            className={`doc-list main-item ${selected.includes(path) ? "doc-list-selected" : ""}`}
            onClick={() => docClick(path)}
            key={"doclist" + fileMes[0]}
            >
            <FileText fileMes={fileMes} editMode={editMode} 
            nameEdit={[nameInput,setNameInput]} rename={rename}/>
            <EditBtn name={fileMes[0]} editing={[editMode, setEditMode]} 
            newName={nameInput} rename={rename}/>
            <DownloadBtn fileMes={fileMes}/>
        </div>
    )
}
function rename(oldname,newname){
    if(oldname==newname){
        return
    }
    const global=useGlobal.getState()
      loadPage(true)
    const oldpath=global.nowPath+"/"+oldname
    const newpath=global.nowPath+"/"+newname
    fetch(global.docUrl+"rename",{
        method:"POST",
        headers:{
            'Content-Type':'application/json',
            'authorization':"Bearer " +global.token,
            'x-user':global.userName
        },
        body:JSON.stringify({oldpath,newpath})
    })
    .then(res=>{
        if(res.ok){
            notify(GetText("op_com"))
            list(global.nowPath)
        }
        else{
            if(res.status===401){
               notify(GetText("no_per"))
            }
            else{
                notify(GetText("error")+":"+res.status)
            }
             loadPage(false)
        }
    })
}