import { useGlobal ,list} from "../global"
import { notify } from "../../public/notify"
export default function Relaod(){
    return(
        <button id="reload" className="btn side-btn" 
        title="刷新" onClick={()=>{
            list(useGlobal.getState().nowPath)
            notify("刷新成功")
        }}
        ></button>
    )
}