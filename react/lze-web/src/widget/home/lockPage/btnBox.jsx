import UnlockBtn from "./unlockBtn"
import LoadBtn from "./loadbtn"
import LogoutBtn from "./logoutBtn"
export default function BtnBox({prop}){
    return(
        <div id="btn-box">
            <LoadBtn/>
            <UnlockBtn setTmpLoad={prop}/>
            <LogoutBtn/>
        </div>
    )
}