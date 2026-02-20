import { notify } from "../../../utils/common";
import {GetWidgetData, useGlobal } from "../global";
import {GetText} from "../../../utils/common"
import {confirmWin} from "../../../utils/common"
import { getUsername, setToken, setUsername, useRequestStore } from "../../../store/request";
import { Icon } from "../../../utils/icon";
export default function LogoutBtn(){
    const user=useRequestStore(state=>state.request.username)
    return(
        <button id="logout-btn" className={"btn lock-btn "+(user=='guest'?"logout-disabled":"")}
        onClick={()=>logout()}
        >
            {Icon("logout")}
            <span>{GetText("exit")}</span>
        </button>
    )
}
async function logout(){
    if (await confirmWin.normal(GetText("are_you_sure"))) {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername('guest')
    setToken('')
    GetWidgetData()
    notify.normal(GetText('logout'))
    }
}