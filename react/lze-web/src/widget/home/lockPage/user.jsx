import {GetText} from "../../../utils/common"
import { useRequestStore } from "../../../store/request"
export default function User({setSwitch}){
    const user=useRequestStore(state=>state.request.username)
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