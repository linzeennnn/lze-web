import { GetText, list, useGlobal } from "../global"
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