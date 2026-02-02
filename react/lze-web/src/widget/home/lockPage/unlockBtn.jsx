import { useGlobal } from "../global";
import {GetText} from "../../../utils/common"
import {Icon} from "../../../utils/icon";
export default function UnlockBtn({setTmpLoad}){
    return(
        <button id="unlock-btn" className="btn lock-btn"
         onClick={()=>{
                        setTmpLoad(false)
                        setTimeout(() => {
                                useGlobal.setState({locked:false})
                            setTmpLoad(true)
                            
                        }, 500);
                            }}
        >
            <div>
                {Icon("power")}
            </div>
            <span>{GetText("start")}</span>
        </button>
    )
}