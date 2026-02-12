import { Icon } from "../../../utils/icon"
import FileItem from "../../common/fileList/fileItem"
import { list, useGlobal } from "../global"
import DownloadBtn from "./downloadBtn"
import Link from "./link"
export default function fileItme({fileMes,selected,docClick}){
    const include=selected.selected.includes(fileMes[0])
    function FileItemMask(){
        return(
            <div className={'file-item-mask '
                +(selected.status&&include?'file-item-mask-selected':'')} 
        onClick={()=>{MaskClick(include,fileMes[0])}}></div>
        )
    }
    function FileBtn(){
       return( <>
        {(fileMes[1]!="dir"&&fileMes[1]!="dir_link"&&<Link name={fileMes[0]}/>)}
        <DownloadBtn fileMes={fileMes}/>
        </>)
    }
    function NameText(){
        return(<>
        <input></input>
        </>)
    }
    return(
            <FileItem name={fileMes[0]} type={fileMes[1]}
             Fun={ClickFun} 
             mask={selected.status?<FileItemMask/>:null}
             fileBtn={<FileBtn/>}
            nameText={<NameText/>}
             /> 
    )
}
function ClickFun(name){
    useGlobal.getState().nowPath
        list(useGlobal.getState().nowPath + "/" + name)
}
function MaskClick(include,name){
    let tmpSelected=useGlobal.getState().selected.selected
    if(include){
        tmpSelected=tmpSelected.filter(item=>item!==name)
    }else{
        tmpSelected.push(name)
    }
    useGlobal.setState({selected:{...useGlobal.getState().selected,selected:tmpSelected}})
}