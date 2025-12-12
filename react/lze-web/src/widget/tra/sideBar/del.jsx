import { useGlobal,list,loadPage } from "../global"
import { GetText } from '../../../utils/common';
import { notify } from '../../../utils/common';
export default function Del(){

    const user=useGlobal((state)=>state.userName)
    const token=useGlobal((state)=>state.token)
    const nowPath=useGlobal((state)=>state.nowPath)
    const url=useGlobal((state)=>state.traUrl)+"del"
        const clean=()=>{
            if(!confirm(GetText("are_you_sure"))){
                return
            }
            loadPage(true)
            const  send_data={user,token}
            
            fetch(url,{
                method:"POST",
                body:JSON.stringify(send_data),
                headers:{
                    'Content-Type':'application/json',
            'authorization':"Bearer " +token
                }
            }).then(res=>{
                if(!res.ok){
                   if(res.status==401){
                    notify.err(GetText("no_per"))
                   }
                   else{
                    notify.err(GetText("error")+":"+res.status)
                   }
                   loadPage(false)
                   return
                }
                notify.normal(GetText("op_com"))
                list(nowPath)
            })
        }

    return(
        <button id="del" className="btn side-btn" 
        onClick={()=>{clean()}}
        title={GetText("clear_tra")}></button>
    )
}