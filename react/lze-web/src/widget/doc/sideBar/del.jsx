
import { notify } from "../../../utils/common";
import { useGlobal,list,loadPage} from "../global"
import { GetText } from '../../../utils/common';
export default function Del(){
    return(
        <button id="del" className="btn side-btn"
        title={GetText("delete")} onClick={()=>delete_file()}
        ></button>
    )
}
function delete_file(){
    if(confirm(GetText("are_you_sure"))){
        loadPage(true)
        const global=useGlobal.getState()
        const user=global.userName
        const token=global.token
        const dellist=global.selected
        const url=global.docUrl+"del"
        fetch(url,{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
            'authorization':"Bearer " +token
            },
            body:JSON.stringify({dellist})
       })
       .then(res=>{
        if(res.ok){
            notify.normal(GetText("op_com"))
            list(global.nowPath)
        }else{
            if(res.status==401){
                notify.err(GetText("no_per"))
            }
            else{
                notify.err(GetText("error")+":"+res.status)
            }
            loadPage(false)
        }
       })
    }
}