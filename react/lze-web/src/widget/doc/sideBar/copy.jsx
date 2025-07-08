import { useGlobal } from "../global"
export default function Copy({setPaste,setCopyList}){
    return(
        <button id="copy" className="btn side-btn"
        title="复制" onClick={()=>{
            const selected=useGlobal.getState().selected
            setCopyList([...selected])
            setPaste({status:true,type:"copy"})
        }}
        ></button>
    )
}