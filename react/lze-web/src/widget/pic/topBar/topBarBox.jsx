import ShowPath from "./showPath"
import UploadBar from "./uploadBar"
import { useGlobal } from "../global"
export default function TopBarBox(){
    const upload=useGlobal((state)=>state.upload)
    return(
        <div id="top-bar-box">
            {upload.status?<UploadBar/>:<ShowPath/>
            }
        </div>
    )
}