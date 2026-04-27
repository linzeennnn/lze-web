import { useUploadStore } from '../../../store/upload';
export default function UploadBar(){
    
  const percent=useUploadStore((state)=>state.upload.percent)
    return(
        <div id="upload-box">
            <div id="progress-box">
                <div id="progress-bar"
                style={{width:percent+"%"}}
                ></div>
            </div>
            <span id="show-percent">{percent+"%"}</span>
        </div>
    )
}