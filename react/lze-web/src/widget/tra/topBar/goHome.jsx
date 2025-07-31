import { GetText, list } from "../global"
export default function GoHome(){
    return(
        <button className="btn top-bar-widget" id="go-home"
        onClick={()=>{list("")}} title={GetText("back_main_dir")}
        ></button>
    )
}