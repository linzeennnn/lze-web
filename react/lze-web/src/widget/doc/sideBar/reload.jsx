import { useGlobal ,list, GetText} from "../global"
import { notify } from "../../../components/notify"
export default function Relaod(){
    return(
        <button id="reload" className="btn side-btn" 
        title={GetText("refresh")} onClick={()=>{
            list(useGlobal.getState().nowPath)
        }}
        ></button>
    )
}