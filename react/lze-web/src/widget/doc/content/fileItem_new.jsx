import FileItem from "../../common/fileList/fileItem"
import FileName from "../../common/fileList/fileName"
import { list, useGlobal } from "../global"
export default function fileItme({fileMes,selected,docClick}){
    const nowPath = useGlobal((state) => state.nowPath);
    const ClickFun=(name)=>{
        list(nowPath + "/" + name)
    }
    return(
        <>
        <div className="file-item-box" title={fileMes[0]}>
            <FileItem name={fileMes[0]} type={fileMes[1]}
             Fun={ClickFun}/>
            <FileName name={fileMes[0]}/>
            </div>
        </>
    )
}