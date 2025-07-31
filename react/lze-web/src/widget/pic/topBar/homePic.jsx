import {useGlobal, list, GetText } from "../global"
import { notify } from "../../../components/notify"
export default function HomePic(){
    const nowPath=useGlobal((state)=>state.nowPath)
    return(
        <button id="home-pic" className="btn" 
        onClick={()=>{
           nowPath==""? notify(GetText("main_album")):list("")
        }} title={GetText("back_main_album")}
        ></button>
    )
}