import { useGlobal } from "../global"
export default function UploadBar(){
    const upload=useGlobal((state)=>state.upload)
    return(
        <div id="upload-box">
            <div id="progress-box">
                <div id="progress-bar"
                style={{width:upload.percent}}
                ></div>
            </div>
            <span id="show-percent">{upload.percent}</span>
        </div>
    )
}