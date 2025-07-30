import { useGlobal } from "../global"

export default function User(){
    const user=useGlobal(state=>state.userName)
    return(
        <button className="btn" id="lock-user" title="编辑">
            <div id="lock-profile"></div>
            <div id="lock-edit"></div>
            <span>{(user==""||user=="visitor")?"访客":user}</span>
        </button>
    )
}