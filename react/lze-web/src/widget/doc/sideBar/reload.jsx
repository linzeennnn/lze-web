import { useGlobal ,list} from "../global"
import { AddMouseMenu, GetText } from '../../../utils/common';
import { useEffect } from "react";
export default function Relaod(){
    const refresh=()=>{
            list(useGlobal.getState().nowPath)
    }
     useEffect(() => {
        AddMouseMenu({
          refresh: {
            name: GetText("refresh"),
            fun: refresh,  
          }
        });
      }, []);
    return(
        <button id="reload" className="btn side-btn" 
        title={GetText("refresh")} onClick={refresh}
        ></button>
    )
}