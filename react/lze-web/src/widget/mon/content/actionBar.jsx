import {useGlobal,list,loadPage} from '../global'
import { notify } from '../../../components/notify'
export default function ActionBar({keyName,Mes}){
    const nowuser=useGlobal((state)=>state.nowuser)
    return(
        <div 
        className={
            "action-bar "+(Mes.user.includes(nowuser)?
            "have-action":"no-action")
        }
        title='修改权限'
        onClick={()=>{
            update_act(keyName.control,keyName.action,nowuser,(Mes.user.includes(nowuser)?
            "remove":"add"))
        }}
        >{Mes.name}</div>
    )
}
function update_act(control,action,name,change){
    let ch
    switch(change){
        case "add":
            ch="增加"
            break
        case "remove":
            ch="移除"
            break
    }
    if(!confirm("确定"+ch+"该权限吗?")){
        return
    }
    loadPage(true)
    const user=useGlobal.getState().userName
    const token=useGlobal.getState().token
    const url=useGlobal.getState().monUrl+"update_act"
    fetch(url,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify({
            user,token,control,action,name,change
        })
    }).then(res=>{
        if(!res.ok){
            if(res.status===401){
                notify("登录过期")
            }else{
                notify(res.status+"错误")
            }
            loadPage(false)
            return
        }
        notify("修改成功")
        list()
    })
}