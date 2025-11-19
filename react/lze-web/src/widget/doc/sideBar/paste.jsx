import {useGlobal,list,loadPage, GetText} from '../global'
import {notify} from '../../../components/notify'
export default function Paste({paste,copyList}){
    const[pastestatus,setPastestatus]=paste
    
    return(
        pastestatus.status?(<button id="paste" 
            title={GetText("paste")}
            className="btn side-btn"
        onClick={()=>{
            setPastestatus({status:false})
            paste_file(pastestatus.type,copyList)
        }} ></button>):(<></>)
    )
}
function paste_file(type,copylist){
    const global=useGlobal.getState()
    
    if(copylist.length==0){
        notify(GetText("no_select_file"))
        return
    }
    loadPage(true)
    const token=global.token
    const user=global.userName
    const nowpath=global.nowPath
    const send_data={
        copylist,nowpath
    }
    let url
    
    switch(type){
        case "copy":
            url=global.docUrl+"copy"
            break;
        case "move":
            url=global.docUrl+"move"
            break;
    }
    fetch(url,{
        method:"POST",
        headers:{  
            'Content-Type':'application/json',
            'authorization':"Bearer " +token
        },
        body:JSON.stringify(send_data)})
        .then(res=>{
            if(res.ok){
                notify(GetText("op_com"))
                list(nowpath)
            }
            else{
                if(res.status==401){
                    notify(GetText("no_per"))
                }
                else{
                    notify(GetText("error")+":"+res.status)
                }
                loadPage(false)
            }
        })
}