import { useGlobal,list,loadPage } from "../global"
import { notify } from "../../../components/notify"
export default function Recover(){
    const user=useGlobal((state)=>state.userName)
    const token=useGlobal((state)=>state.token)
    const recover_list=useGlobal((state)=>state.selected)
    const source_path=useGlobal((state)=>state.source_path)
    const nowPath=useGlobal((state)=>state.nowPath)
    const url=useGlobal((state)=>state.traUrl)+"recover"
    const recover=()=>{
        if(recover_list.length==0){
            notify("未选择文件")
            return
        }
        if(!confirm("确认恢复吗？")){
            return
        }
        loadPage(true)
        const  send_data={user,token,recover_list,source_path}
        
        fetch(url,{
            method:"POST",
            body:JSON.stringify(send_data),
            headers:{
                "Content-Type":"application/json"
            }
        }).then(res=>{
            if(!res.ok){
               if(res.status==401){
                notify("无恢复文件权限")
               }
               else{
                notify("恢复失败"+res.status+"错误")
               }
               loadPage(false)
               return
            }
            notify("恢复完成")
            list(nowPath)
        })
    }
    return(
        <button className="btn side-btn" id="recover" title="恢复"
        onClick={()=>{recover()}}
        ></button>
    )
}