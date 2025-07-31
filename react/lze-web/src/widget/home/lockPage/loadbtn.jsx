import { useEffect, useState } from "react"
import { GetText, InitData, useGlobal } from "../global"

export default function LoadBtn(){
    const [loading, setLoading] = useState(false)
    const load=useGlobal(state=>state.load)
    useEffect(()=>{
        if(load==2) setLoading(false)
    },[load])
    return(
        loading?
        <div className="loading" id="lock-loading"> </div>:
        <button id="load-btn" className="btn lock-btn"
        onClick={()=>{
            setLoading(true)
            useGlobal.setState({load:0})
            InitData()
        }}
        >
            <div></div>
            <span>{GetText("refresh")}</span>
        </button>
    )
}