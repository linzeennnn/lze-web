import { useGlobal,list,loadPage } from "../global"
import { notify } from "../../../components/notify"
export default function Del({name}){
    return(
        <button id="del-btn" className="btn"
        title="删除"
        onClick={()=>del(name)}
        ></button>
    )
}
function del(fileName){
    if(!confirm("确认删除吗"))
        return
    const user =useGlobal.getState().userName
    const token =useGlobal.getState().token
    const url=useGlobal.getState().notUrl+"del"
    const send_data={user,token,fileName}
    loadPage(true)
    fetch(url,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(send_data)
    })
    .then(res=>{
        if(!res.ok){
            if(res.status==401){
                notify("没有权限")
            }else{
                notify(res.status+"错误")
            }
            loadPage(false)
            return
        }
        notify("删除成功")
        list()
    })
}