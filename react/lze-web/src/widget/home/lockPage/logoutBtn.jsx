import { notify } from "../../../utils/common";
import {GetWidgetData, useGlobal } from "../global";
import {GetText} from "../../../utils/common"
import {confirmWin} from "../../../utils/common"
export default function LogoutBtn(){
    const user=useGlobal(state=>state.userName)
    return(
        <button id="logout-btn" className={"btn lock-btn "+(user=='guest'?"logout-disabled":"")}
        onClick={()=>logout()}
        >
            <div></div>
            <span>{GetText("exit")}</span>
        </button>
    )
}
async function logout(){
    if (await confirmWin.normal(GetText("are_you_sure"))) {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    useGlobal.setState({
        userName:'guest',
        token:""
    })
    GetWidgetData()
    notify.normal(GetText('logout'))
    }
}