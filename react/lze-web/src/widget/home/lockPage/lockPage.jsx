import { useState } from "react"
import { useGlobal } from "../global"
import LockMainPage from "./lockMainPage";
import LoginPage from "./loginPage";
export default function LockPage(){
    const [switchLogin,setSwitch]=useState(false)
    const locked =useGlobal(state => state.locked);
      const[tmpLoad,setTmpLoad]=useState(true)
    return(
        <div id="lock-page" className={(locked&&tmpLoad)?"lock-page-load":""}>
            <div id="head-bar" className={(locked&&tmpLoad)?"head-bar-load":""}>
                <div id="head-name"></div>
            </div>
            {switchLogin?
                <LoginPage setSwitch={setSwitch}/>:
            <LockMainPage prop={{
                unlock:setTmpLoad,
                switch:setSwitch
                }}/>
                }
        </div>
    )
}