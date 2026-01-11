import { useGlobal,list,loadPage } from "../global"
import { GetText,notify,confirmWin } from "../../../utils/common"
import { Api } from "../../../utils/request"
export default function Del({name}){
    return(
        <button id="del-btn" className="btn"
        title={GetText("delete")}
        onClick={()=>del(name)}
        ></button>
    )
}
async function del(fileName){
    if(!await confirmWin.normal(GetText("are_you_sure")))
        return
    const user =useGlobal.getState().userName
    const token =useGlobal.getState().token
    const url=useGlobal.getState().notUrl+"del"
    const send_data={user,token,fileName}
    loadPage(true)
    fetch(url,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'authorization': "Bearer "+token
        },
        body: JSON.stringify(send_data)
    })
    .then(res=>{
        if(!res.ok){
            if(res.status==401){
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

    Api.delete({
        api:'not/del',
        body:{fileName},
        notice:true,
        success:()=>{
            list()
        }
    })
}