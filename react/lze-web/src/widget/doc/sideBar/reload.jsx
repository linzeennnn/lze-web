import { useGlobal ,list} from "../global"
import { GetText } from '../../../utils/common';
export default function Relaod(){
    return(
        <button id="reload" className="btn side-btn" 
        title={GetText("refresh")} onClick={()=>{
            list(useGlobal.getState().nowPath)
        }}
        ></button>
    )
}