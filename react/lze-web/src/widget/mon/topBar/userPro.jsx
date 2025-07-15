import { useState } from "react"

export default function UserPro({Mes}){
    const[showuser,setShowUser] = useState(false)
    return(
        <div id="user-box">
        <button id="user-btn" className="btn" title="查看用户"
        onClick={()=>{
            setShowUser(true)
        }}
        ></button>
        <span id="user-text"
        onClick={()=>{
            setShowUser(true)
        }}
        >sssss</span>
        {showuser?(<><div id="user-list"></div>
        <div id="user-back"
        onClick={()=>{setShowUser(false)}}
        ></div></>):null}
        </div>
    )
}