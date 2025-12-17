import {useGlobal,list,loadPage} from '../global'

import { notify } from "../../../utils/common";
import { GetText } from '../../../utils/common';
import { Api } from '../../../utils/request';
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
        notify.err(GetText("no_select_file"))
        return
    }
    const nowpath=global.nowPath
    let url
    
    switch(type){
        case "copy":
            url=global.docUrl+"copy"
            break;
        case "move":
            url=global.docUrl+"move"
            break;
    }
    Api.post({
        api:"doc/"+type,
        notice:true,
        body:{copylist,nowpath},
        success:()=>{
            list(nowpath)
        }
    })
}