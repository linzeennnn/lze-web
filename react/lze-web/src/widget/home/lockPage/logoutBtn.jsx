import { notify } from "../../../components/notify";
import { GetText, GetWidgetData, useGlobal } from "../global";

export default function LogoutBtn(){
    const user=useGlobal(state=>state.userName)
    return(
        <button id="logout-btn" className={"btn lock-btn "+(user=='visitor'?"logout-disabled":"")}
        onClick={()=>logout()}
        >
            <div></div>
            <span>{GetText("logout")}</span>
        </button>
    )
}
function logout(){
    if (confirm(GetText("are_you_sure"))) {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    useGlobal.setState({
        userName:'visitor',
        token:""
    })
    GetWidgetData()
    notify(GetText('logout'))
    }
}