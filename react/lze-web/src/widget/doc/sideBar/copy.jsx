import {useGlobal } from "../global"
import { GetText } from '../../../utils/common';
export default function Copy({setPaste,setCopyList}){
    return(
        <button id="copy" className="btn side-btn"
        title={GetText("copy")} onClick={()=>{
            const selected=useGlobal.getState().selected
            setCopyList([...selected])
            setPaste({status:true,type:"copy"})
        }}
        ></button>
    )
}