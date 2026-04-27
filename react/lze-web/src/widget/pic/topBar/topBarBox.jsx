import ShowPath from "./showPath"
import UploadBar from "./uploadBar"
import { useUploadStore } from '../../../store/upload';
export default function TopBarBox(){
  const upload=useUploadStore((state)=>state.upload)
    return(
        <div id="top-bar-box">
            {upload.status?<UploadBar/>:<ShowPath/>
            }
        </div>
    )
}