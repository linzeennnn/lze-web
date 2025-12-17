
import { useGlobal,list} from "../global"
import { confirmWin,GetText  } from "../../../utils/common";
import { Api } from "../../../utils/request";
export default function Del(){
    return(
        <button id="del" className="btn side-btn"
        title={GetText("delete")} onClick={()=>delete_file()}
        ></button>
    )
}
async function delete_file(){
    if(!await confirmWin.normal(GetText("are_you_sure")))
        return
        const global=useGlobal.getState()
        const dellist=global.selected
        Api.post({
            api:"doc/del",
            notice:true,
            body:{dellist},
            success:()=>{ list(global.nowPath)}
        })
    
}