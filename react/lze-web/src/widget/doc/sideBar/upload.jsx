import {  useGlobal } from "../global"
import { GetText } from '../../../utils/common';
import { Icon } from "../../../utils/icon";
export default function Upload(){
    const setGlobal=useGlobal.setState
     const upload = useGlobal((state) => state.upload);
    return (
        <>
    <button  className="btn side-btn"
    title={GetText("upload")} onClick={()=>{
        setGlobal({upload:{
            ...upload,
            win:true
        }})
    
    }}
    >{Icon("upload")}</button>
   
    </>
)
}