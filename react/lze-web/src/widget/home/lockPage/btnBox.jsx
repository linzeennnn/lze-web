import UnlockBtn from "./unlockBtn"
import LoadBtn from "./loadbtn"
import SwitchBtn from "./switchBtn"
export default function BtnBox({unlockProp}){
    return(
        <div id="btn-box">
            <LoadBtn/>
            <UnlockBtn setTmpLoad={unlockProp}/>
            <SwitchBtn/>
        </div>
    )
}