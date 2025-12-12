import {  useGlobal } from "../global"
import { GetText } from '../../../utils/common';
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