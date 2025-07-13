import {useGlobal, list } from "../global"
import { notify } from "../../public/notify"
export default function HomePic(){
    const nowPath=useGlobal((state)=>state.nowPath)
    return(
        <button id="home-pic" className="btn" 
        onClick={()=>{
           nowPath==""? notify("已在主相册"):list("")
        }} title="返回主相册"
        ></button>
    )
}