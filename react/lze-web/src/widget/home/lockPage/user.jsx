import { GetText, useGlobal } from "../global"

export default function User({setSwitch}){
    const user=useGlobal(state=>state.userName)
    return(
        <button className="btn" id="lock-user" title={GetText("switch")}
        onClick={()=>{setSwitch(true)}}
        >
            <div id="lock-profile"></div>
            <div id="lock-switch"></div>
            <span>{(user==""||user=="visitor")?GetText("guest"):user}</span>
        </button>
    )
}