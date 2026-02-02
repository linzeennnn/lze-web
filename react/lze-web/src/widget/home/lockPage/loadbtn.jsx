import { useEffect, useState } from "react"
import {InitData, useGlobal } from "../global"
import {GetText} from "../../../utils/common"
import { Icon } from "../../../utils/icon"
export default function LoadBtn(){
    const [loading, setLoading] = useState(false)
    const load=useGlobal(state=>state.load)
    useEffect(()=>{
        if(load==2) setLoading(false)
    },[load])
    return(
        loading?
        <div className="loading" id="lock-loading"> </div>:
        <button  className="btn lock-btn"
        onClick={()=>{
            setLoading(true)
            useGlobal.setState({load:0})
            InitData()
        }}
        >
            <div>
            {Icon("load")}
            </div>
            <span>{GetText("refresh")}</span>
        </button>
    )
}