import FileText from "./fileText"
import EditBtn from "./editBtn"
import DownloadBtn from "./downloadBtn"
import { useState } from "react";
import { useGlobal,list,loadPage } from "../global";
import { notify } from "../../public/notify";
export default function FileItem({ fileMes, selected, docClick}){
    const [editMode, setEditMode] = useState(false);
    const[nameInput,setNameInput]=useState(fileMes.name)
      const nowPath=useGlobal.getState().nowPath
      const path=nowPath+"/"+fileMes.name
    return(
        <div
            className={`doc-list ${selected.includes(path) ? "doc-list-selected" : ""}`}
            onClick={() => docClick(path)}
            key={"doclist" + fileMes.name}
            >
            <FileText fileMes={fileMes} editMode={editMode} 
            nameEdit={[nameInput,setNameInput]} rename={rename}/>
        </div>
    )
}