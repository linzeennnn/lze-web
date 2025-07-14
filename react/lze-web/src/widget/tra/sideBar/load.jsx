import { useGlobal,list } from "../global"
export default function Load(){
    const nowPath=useGlobal((state)=>state.nowPath)
    return(
        <button className="btn  side-btn" id="load" title="刷新" onClick={()=>{list(nowPath)}}></button>
    )
}