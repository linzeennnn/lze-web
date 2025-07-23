import { useEffect, useRef, useState } from "react"
import { useGlobal } from "../global"

export default function LockPage(){
    const locked =useGlobal(state => state.locked);
      const[tmpLoad,setTmpLoad]=useState(true)
    return(
        <div id="lock-page" className={(locked&&tmpLoad)?"lock-page-load":""}>
            <div id="head-bar" className={(locked&&tmpLoad)?"head-bar-load":""}>
                <div id="head-name"></div>
            </div>
            <button className="btn" id="unlock-btn" title="开始"
            onClick={()=>{
                setTmpLoad(false)
                setTimeout(() => {
                        useGlobal.setState({locked:false})
                    setTmpLoad(true)
                    
                }, 500);
                    }}
            ></button>
        </div>
    )
}