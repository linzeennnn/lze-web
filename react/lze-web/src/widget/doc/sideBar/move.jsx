import { useGlobal } from "../global"
export default function Move({setPaste,setCopyList}){
    return(
        <button id="move" className="btn side-btn"
        title="剪切" onClick={()=>{
            const selected=useGlobal.getState().selected
            setCopyList([...selected])
            setPaste({status:true,type:"move"})
        }}>
        </button>
    )
}