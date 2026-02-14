import { list} from "../global"
import { AddMouseMenu, GetText } from '../../../utils/common';
import { useEffect } from "react";
import { Icon } from "../../../utils/icon";
import { getNowPath } from "../../../store/CacheList";
export default function Relaod(){
    const refresh=()=>{
            list(getNowPath())
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
        <button className="btn side-btn" 
        title={GetText("refresh")} onClick={refresh}
        >{Icon("load")}</button>
    )
}