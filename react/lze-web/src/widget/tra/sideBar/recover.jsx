import { useGlobal,list,loadPage } from "../global"
import { GetText } from '../../../utils/common';
import { notify,confirmWin } from '../../../utils/common';
import { Api } from "../../../utils/request";
export default function Recover(){
    const recover_list=useGlobal((state)=>state.selected)
    const source_path=useGlobal((state)=>state.source_path)
    const nowPath=useGlobal((state)=>state.nowPath)
    const recover=async ()=>{
    Api.post({
        api:"tra/recover",
        body:{recover_list,source_path},
        notice:true,
        end:()=>{
            list(nowPath)
        }
    })
    }
    return(
        <button className="btn side-btn" id="recover" title={GetText("restore")}
        onClick={()=>{recover()}}
        ></button>
    )
}