import { GetText, useGlobal } from "../global"
export default function Move({setPaste,setCopyList}){
    return(
        <button id="move" className="btn side-btn"
        title={GetText("cut")} onClick={()=>{
            const selected=useGlobal.getState().selected
            setCopyList([...selected])
            setPaste({status:true,type:"move"})
        }}>
        </button>
    )
}