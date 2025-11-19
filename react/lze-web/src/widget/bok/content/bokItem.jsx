import { useGlobal,list,loadPage, GetText } from "../global"
import { notify } from "../../../components/notify"
export default function BokItem({name}){
    return(
        <div className="bookmark main-item"
        title={GetText("view")+name}
        onClick={()=>{
            open_link(name)
        }}
        >
        <button className="btn" id="del-btn" title={GetText("delete")}
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
        notify(+GetText("error")+":"+res.status)
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
    if(!confirm(GetText("are_you_sure"))){
        return
    }
    loadPage(true)
const user=useGlobal.getState().userName
const token=useGlobal.getState().token
const url=useGlobal.getState().bokUrl+'del'
fetch(url,{
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
        'authorization':'Bearer '+token
    },
    body: JSON.stringify({name})
}).then((res) => {
    if(!res.ok){
        if(res.status===401){
            notify(GetText("no_per"))
        }
        else{
            notify(GetText("error")+":"+res.status)
        }
        loadPage(false)
        return
    }
    notify(GetText("op_com"))
    list()
})
}