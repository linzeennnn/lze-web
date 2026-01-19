import { useGlobal,list,loadPage } from "../global"
import { GetText,notify,confirmWin } from "../../../utils/common"
import { Api } from "../../../utils/request"
export default function Del({name}){
    return(
        <button id="del-btn" className="btn"
        title={GetText("delete")}
        onClick={()=>del(name)}
        ></button>
    )
}
async function del(fileName){
    if(!await confirmWin.normal(GetText("are_you_sure")))
        return
    Api.delete({
        api:'not/del',
        body:{fileName},
        notice:true,
        success:()=>{
            list()
        }
    })
}