import { useGlobal,list,loadPage } from "../global"
import { notify,GetText } from "../../../utils/common"
import { confirmWin } from "../../../utils/common"
import { Api } from "../../../utils/request"
export default function BokItem({name}){
    return(
        <div className="bookmark main-item"
        title={GetText("view")+name}
        onClick={()=>{
            open_link(name)
        }}
        >
        <button className="btn" id="del-btn" title={GetText("delete")}
        onClick={(e)=>{
            e.stopPropagation()
            del(name)}}
        ></button>
            <span>{name}</span>
        </div>
    )
}
function open_link(name){
Api.post({
    api:'bok/get_url',
    body:{name},
    success:(data)=>{
    window.location.href=data
    }
})
}
async function del(name){
    if(!(await confirmWin.normal(GetText("are_you_sure")))){
        return
    }
Api.delete({
    api:'bok/del',
    body:{name},
    notice:true,
    success:()=>{
        list()
    }
})
}