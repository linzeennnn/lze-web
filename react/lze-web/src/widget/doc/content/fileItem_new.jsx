import FileItem from "../../common/fileList/fileItem"
import { list, useGlobal } from "../global"
export default function fileItme({fileMes,selected,docClick}){
    const include=selected.selected.includes(fileMes[0])
    function FileItemMask(){
        return(
            <div className={'file-item-mask '
                +(selected.status&&include?'file-item-mask-selected':'')} 
        onClick={()=>{MaskClick(include,fileMes[0])}}></div>
        )
    }
    return(
            <FileItem name={fileMes[0]} type={fileMes[1]}
             Fun={ClickFun} 
             mask={selected.status?<FileItemMask/>:null}
             
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