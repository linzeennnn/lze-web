import { useGlobal,list,loadPage } from "../global"
import { GetText,confirmWin } from '../../../utils/common';
import { Api } from "../../../utils/request";
export default function Del(){
    const nowPath=useGlobal((state)=>state.nowPath)
        const clean=async ()=>{
        Api.delete({
            api:"tra/del",
            notice:true,
            end:()=>{
                list(nowPath)
            }
        })
        }
    return(
        <button id="del" className="btn side-btn" 
        onClick={()=>{clean()}}
        title={GetText("clear_tra")}></button>
    )
}