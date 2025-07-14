import { useGlobal,list,loadPage } from "../global"
import { notify } from "../../public/notify"
export default function Del(){

    const user=useGlobal((state)=>state.userName)
    const token=useGlobal((state)=>state.token)
    const nowPath=useGlobal((state)=>state.nowPath)
    const url=useGlobal((state)=>state.traUrl)+"del"
        const clean=()=>{
            if(!confirm("确认清空回收站吗？")){
                return
            }
            loadPage(true)
            const  send_data={user,token}
            
            fetch(url,{
                method:"POST",
                body:JSON.stringify(send_data),
                headers:{
                    "Content-Type":"application/json"
                }
            }).then(res=>{
                if(!res.ok){
                   if(res.status==401){
                    notify("无权限")
                   }
                   else{
                    notify(res.status+"错误")
                   }
                   loadPage(false)
                   return
                }
                notify("清空完成")
                list(nowPath)
            })
        }

    return(
        <button id="del" className="btn side-btn" 
        onClick={()=>{clean()}}
        title="清空回收站"></button>
    )
}