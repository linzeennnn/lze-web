import { useGlobal,list,loadPage } from "../global"
import { notify } from "../../public/notify"
export default function BokItem({bokMes}){
    return(
        <div className="bookmark"
        title={"访问:"+bokMes.name}
        onClick={()=>{
            window.location.href=bokMes.content
        }}
        >
        <button className="btn" id="del-btn" title="删除该书签"
        onClick={(e)=>{
            e.stopPropagation()
            del(bokMes.name)}}
        ></button>
            <span>{bokMes.name}</span>
        </div>
    )
}
function del(name){
    if(!confirm("确认删除书签:"+name+"?")){
        return
    }
    loadPage(true)
const user=useGlobal.getState().userName
const token=useGlobal.getState().token
const url=useGlobal.getState().bokUrl+'del'
const send_data={user,token,name}
fetch(url,{
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(send_data)
}).then((res) => {
    if(!res.ok){
        if(res.status===401){
            notify("无权限")
        }
        else{
            notify("删除失败"+res.status+"错误")
        }
        loadPage(false)
        return
    }
    notify("删除成功")
    list()
})
}