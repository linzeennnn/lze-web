import { useState } from "react"
import { useGlobal } from "../global";

export default function UserPro({Mes}){
    const[showuser,setShowUser] = useState(false)
    const userconfig=useGlobal((state)=>state.userList)
    const nowuser=useGlobal((state)=>state.nowuser)
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
        >{nowuser}</span>
        {showuser?(<><div id="user-list">
            {userconfig.map(([name])=>{
                
            })}
        </div>
        <div id="user-back"
        onClick={()=>{setShowUser(false)}}
        ></div></>):null}
        </div>
    )
}