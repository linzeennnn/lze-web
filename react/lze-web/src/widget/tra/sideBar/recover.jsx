import { useGlobal,list,loadPage, GetText } from "../global"
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
            notify(GetText("no_select_file"))
            return
        }
        if(!confirm(GetText("are_you_sure"))){
            return
        }
        loadPage(true)
        const  send_data={user,token,recover_list,source_path}
        
        fetch(url,{
            method:"POST",
            body:JSON.stringify(send_data),
            headers:{
                'Content-Type':'application/json',
            'authorization':"Bearer " +token,
            'x-user':user
            }
        }).then(res=>{
            if(!res.ok){
               if(res.status==401){
                notify(GetText("no_per"))
               }
               else{
                notify(GetText("error")+":"+res.status)
               }
               loadPage(false)
               return
            }
            notify(GetText("op_com"))
            list(nowPath)
        })
    }
    return(
        <button className="btn side-btn" id="recover" title={GetText("restore")}
        onClick={()=>{recover()}}
        ></button>
    )
}