import { useGlobal } from "../global"
import {GetText} from "../../../utils/common"
export default function User({setSwitch}){
    const user=useGlobal(state=>state.userName)
    return(
        <button className="btn" id="lock-user" title={GetText("switch")}
        onClick={()=>{setSwitch(true)}}
        >
            <div id="lock-profile"></div>
            <div id="lock-switch"></div>
            <span>{(user==""||user=="guest")?GetText("guest"):user}</span>
        </button>
    )
}