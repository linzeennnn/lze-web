import {useGlobal,list,loadPage} from '../global'
import { GetText,notify } from '../../../utils/common'
import { confirmWin } from '../../../utils/confirmWin'
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
    loadPage(true)
    const user=useGlobal.getState().userName
    const token=useGlobal.getState().token
    const url=useGlobal.getState().monUrl+"update_act"
    fetch(url,{
        method:"POST",
        headers:{
            'Content-Type':'application/json',
            'authorization':"Bearer " +token
        },
        body:JSON.stringify({
            user,token,control,action,name,change
        })
    }).then(res=>{
        if(!res.ok){
            if(res.status===401){
                notify.err(GetText("no_per"))
            }else{
                notify.err(GetText("error")+":"+res.status)
            }
            loadPage(false)
            return
        }
        notify.normal(GetText("op_com"))
        list()
    })
}