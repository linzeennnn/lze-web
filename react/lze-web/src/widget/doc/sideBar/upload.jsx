import {  useGlobal } from "../global"
import { GetText } from '../../../utils/common';
import { Icon } from "../../../utils/icon";
export default function Upload(){
    const setGlobal=useGlobal.setState
    return (
        <>
    <button  className="btn side-btn"
    title={GetText("upload")} onClick={()=>{
        setGlobal({uploadWin:true})
    
    }}
    >{Icon("upload")}</button>
   
    </>
)
}