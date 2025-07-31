import { GetText } from "../global";

export default function LogoutBtn(){
    return(
        <button id="logout-btn" className="btn lock-btn"
        onClick={()=>logout()}
        >
            <div></div>
            <span>{GetText("logout")}</span>
        </button>
    )
}
function logout(){
    if (confirm(GetText("are_you_sure"))) {
    localStorage.clear();
    window.location.reload();
    }
}