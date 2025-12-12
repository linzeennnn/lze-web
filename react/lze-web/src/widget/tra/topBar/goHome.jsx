import { list, useGlobal } from "../global"
import { GetText } from '../../../utils/common';
export default function GoHome(){
        const nowpath=useGlobal(state=>state.nowPath)
    return(
        <button className="btn top-bar-widget" id="go-home"
        onClick={()=>{
            if(nowpath=="")
                return
            list("")
        }} title={GetText("back_main_dir")}
        ></button>
    )
}