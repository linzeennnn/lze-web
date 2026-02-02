import {GetText} from "../../../utils/common"
import { useRequestStore } from "../../../store/request"
import { Icon } from "../../../utils/icon"
export default function User({setSwitch}){
    const user=useRequestStore(state=>state.request.username)
    return(
        <button className="btn" id="lock-user" title={GetText("switch")}
        onClick={()=>{setSwitch(true)}}
        >
            <div id="lock-profile">{Icon("user")}</div>
            <div id="lock-switch">{Icon("switch")}</div>
            <span>{(user==""||user=="guest")?GetText("guest"):user}</span>
        </button>
    )
}