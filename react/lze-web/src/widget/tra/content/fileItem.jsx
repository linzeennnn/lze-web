import FileText from "./fileText"
import { useGlobal,list,loadPage } from "../global";
export default function FileItem({ fileMes, selected, traClick}){
      const nowPath=useGlobal.getState().nowPath
      const path=nowPath+"/"+fileMes[0]
    return(
        <div
            className={`tra-list main-item ${selected.includes(path) ? "tra-list-selected" : ""}`}
            onClick={() => traClick(path)}
            key={"tralist" + fileMes[0]}
            >
            <FileText fileMes={fileMes}/>
        </div>
    )
}