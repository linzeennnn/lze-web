import { useState } from "react"
import {useGlobal } from "../global";
import { GetText } from '../../../utils/common';

export default function UserPro({Mes}){
    const[showuser,setShowUser] = useState(false)
    const userconfig=useGlobal((state)=>state.userList)
    const nowuser=useGlobal((state)=>state.nowuser)
    const setGlobal=useGlobal.setState
    return(
        <div id="user-box">
        <button id="user-btn" className="btn" title={GetText("view_user")}
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
            {Object.entries(userconfig).map(([name])=>{
                return(
                <div className="name-item" 
                key={name+"nameList"} onClick={()=>{
                    setGlobal({nowuser:name})
                    setShowUser(false)
                }}
                >
                    <span>{name}</span>
                </div>
                )
            })}
        </div>
        <div id="user-back"
        onClick={()=>{setShowUser(false)}}
        ></div></>):null}
        </div>
    )
}