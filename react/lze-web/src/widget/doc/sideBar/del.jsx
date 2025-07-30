import { notify } from "../../../components/notify"
import { useGlobal,list,loadPage } from "../global"
export default function Del(){
    return(
        <button id="del" className="btn side-btn"
        title="删除文件" onClick={()=>delete_file()}
        ></button>
    )
}
function delete_file(){
    if(confirm("确定删除吗?")){
        loadPage(true)
        const global=useGlobal.getState()
        const user=global.userName
        const token=global.token
        const dellist=global.selected
        const send_data={user,token,dellist}
        const url=global.docUrl+"del"
        fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(send_data)
       })
       .then(res=>{
        if(res.ok){
            notify("已移入回收站")
            list(global.nowPath)
        }else{
            if(res.status==401){
                notify("无删除权限")
            }
            else{
                notify(res.status+"错误")
            }
            loadPage(false)
        }
       })
    }
}