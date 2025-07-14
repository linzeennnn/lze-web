import { list } from "../global"
export default function GoHome(){
    return(
        <button className="btn top-bar-widget" id="go-home"
        onClick={()=>{list("")}} title="回到主目录"
        ></button>
    )
}