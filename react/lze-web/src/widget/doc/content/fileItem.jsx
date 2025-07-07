import FileText from "./fileText"
import EditBtn from "./editBtn"
import DownloadBtn from "./downloadBtn"
import { useState } from "react";
import { useGlobal,list } from "../global";
import { notify } from "../../public/notify";
export default function FileItem({ fileMes, selected, docClick}){
    const [editMode, setEditMode] = useState(false);
    const[nameInput,setNameInput]=useState(fileMes.name)
    return(
        <div
            className={`doc-list ${selected.includes(fileMes.name) ? "doc-list-selected" : ""}`}
            onClick={() => docClick(fileMes.name)}
            key={"doclist" + fileMes.name}
            >
            <FileText fileMes={fileMes} editMode={editMode} 
            nameEdit={[nameInput,setNameInput]} rename={rename}/>
            <EditBtn name={fileMes.name} editing={[editMode, setEditMode]} 
            newName={nameInput} rename={rename}/>
            <DownloadBtn fileMes={fileMes}/>
        </div>
    )
}
function rename(oldname,newname){
    const global=useGlobal.getState()
      useGlobal.setState({
        loading: true,
        showBg: true
    });
    const oldpath=global.nowPath+"/"+oldname
    const newpath=global.nowPath+"/"+newname
    const send_data=JSON.stringify({
            oldpath,newpath,
            user:global.userName,
            token:global.token
        })
        console.log(send_data);
        
    fetch(global.docUrl+"rename",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:send_data
    })
    .then(res=>{
        if(res.ok){
            notify("已重命名["+newname+"]")
            list(global.nowPath)
        }
        else{
            if(res.status===401){
               notify("无重命名权限")
            }
            else{
                notify(res.status+"错误")
            }
              useGlobal.setState({
                loading: false,
                showBg: false
            });
        }
    })
}