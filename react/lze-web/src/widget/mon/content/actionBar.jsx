import {useGlobal,list} from '../global'
import { GetText,notify,confirmWin } from '../../../utils/common'
import { Api } from '../../../utils/request'
export default function ActionBar({keyName,Mes}){
    const nowuser=useGlobal((state)=>state.nowuser)
    return(
        <div 
        className={
            "action-bar "+(Mes.user.includes(nowuser)?
            "have-action":"no-action")
        }
        title={GetText("modify_permission")}
        onClick={()=>{
            update_act(keyName.control,keyName.action,nowuser,(Mes.user.includes(nowuser)?
            "remove":"add"))
        }}
        >{GetText(Mes.name)}</div>
    )
}
async function update_act(control,action,name,change){
    let ch=GetText(change)
    if(!await confirmWin.normal(ch+"?")){
        return
    }
    Api.patch({
        api:'mon/update_act',
        body:{control,action,name,change},
        notice:true,
        success:()=>{
            list()
        }
    })
}