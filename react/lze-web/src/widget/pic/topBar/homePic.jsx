import {useGlobal, list } from "../global"
import { GetText } from "../../../utils/common";
import { notify } from "../../../utils/common";
export default function HomePic(){
    const nowPath=useGlobal((state)=>state.nowPath)
    return(
        <button id="home-pic" className="btn" 
        onClick={()=>{
           nowPath==""? notify.normal(GetText("main_album")):list("")
        }} title={GetText("back_main_album")}
        ></button>
    )
}