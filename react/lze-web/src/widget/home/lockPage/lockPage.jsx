import { useState } from "react"
import { useGlobal } from "../global"
import User from "./user";
import BtnBox from "./btnBox";
export default function LockPage(){
    const locked =useGlobal(state => state.locked);
      const[tmpLoad,setTmpLoad]=useState(true)
    return(
        <div id="lock-page" className={(locked&&tmpLoad)?"lock-page-load":""}>
            <div id="head-bar" className={(locked&&tmpLoad)?"head-bar-load":""}>
                <div id="head-name"></div>
            </div>
            <User/>
            <BtnBox unlockProp={setTmpLoad}/>
        </div>
    )
}