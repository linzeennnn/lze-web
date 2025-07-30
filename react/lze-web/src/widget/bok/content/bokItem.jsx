import { useGlobal,list,loadPage } from "../global"
import { notify } from "../../../components/notify"
export default function BokItem({name}){
    return(
        <div className="bookmark main-item"
        title={"访问:"+name}
        onClick={()=>{
            open_link(name)
        }}
        >
        <button className="btn" id="del-btn" title="删除该书签"
        onClick={(e)=>{
            e.stopPropagation()
            del(name)}}
        ></button>
            <span>{name}</span>
        </div>
    )
}
function open_link(name){
    loadPage(true)
const url =useGlobal.getState().bokUrl+'get_url'
fetch(url,{
    method:'POST',
    headers:{
        'Content-Type':'application/json'
    },
    body:JSON.stringify({name})
})
.then(res=>{
    if(!res.ok){
        notify("获取失败"+res.status+"错误")
        loadPage(false)
        return
    }
   return res.text()})
.then(data=>{
    loadPage(false)
    window.location.href=data
})
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