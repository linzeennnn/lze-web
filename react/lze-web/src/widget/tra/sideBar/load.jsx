import { useGlobal,list} from "../global"
import { GetText } from '../../../utils/common';
export default function Load(){
    const nowPath=useGlobal((state)=>state.nowPath)
    return(
        <button className="btn  side-btn" id="load" title={GetText("refresh")} onClick={()=>{list(nowPath)}}></button>
    )
}