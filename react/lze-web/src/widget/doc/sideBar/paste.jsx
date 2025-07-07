import {useGlobal,list,loadPage} from '../global'
import {notify} from '../../public/notify'
export default function Paste({paste}){
    const[pastestatus,setPastestatus]=paste
    return(
        pastestatus.status?(<button id="paste" className="btn side-btn"
        onClick={()=>{
            setPastestatus({status:false})
            paste_file(pastestatus.type)
        }} ></button>):(<></>)
    )
}
function paste_file(type){
    const global=useGlobal.getState()
    const copylist=global.selected
    if(copylist.length==0){
        notify("没有选择文件")
        return
    }
    loadPage(true)
    const token=global.token
    const user=global.user
    const nowpath=global.nowPath
    const send_data={
        copylist,nowpath,user,token
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
    console.log(copylist);
    
    // fetch(url,{
    //     method:"POST",
    //     headers:{
    //         "Content-Type":"application/json"
    //     },
    //     body:JSON.stringify(send_data)})
    //     .then(res=>{
    //         if(res.ok){
    //             notify("已粘贴")
    //             list(nowpath)
    //         }
    //         else{
    //             if(res.status==401){
    //                 notify("无权限")
    //             }
    //             else{
    //                 notify(res.status+"错误")
    //             }
    //             loadPage(false)
    //         }
    //     })
}