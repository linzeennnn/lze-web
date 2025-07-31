import { useGlobal,list,loadPage, GetText } from "../global"
import { notify } from "../../../components/notify"
export default function Del({name}){
    return(
        <button id="del-btn" className="btn"
        title={GetText("delete")}
        onClick={()=>del(name)}
        ></button>
    )
}
function del(fileName){
    if(!confirm(GetText("are_you_sure")))
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
                notify(GetText("no_per"))
            }else{
                notify(GetText("error")+":"+res.status)
            }
            loadPage(false)
            return
        }
        notify(GetText("op_com"))
        list()
    })
}