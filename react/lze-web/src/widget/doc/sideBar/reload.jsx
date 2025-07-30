import { useGlobal ,list} from "../global"
import { notify } from "../../../components/notify"
export default function Relaod(){
    return(
        <button id="reload" className="btn side-btn" 
        title="刷新" onClick={()=>{
            list(useGlobal.getState().nowPath)
        }}
        ></button>
    )
}