import { useGlobal} from "../global";
export default function UploadWin() {
    const dragWin=useGlobal((state) => state.dragWin); 
    const upload=useGlobal((state) => state.upload); 
    return(
        <>
        <div id="drag-win"
        style={dragWin?{display:"flex"}:{display:"none"}}
        >
            <div></div>
        </div>
       {upload.status&&<div id="uploading" className="bg-enable"></div>}
        </>
    )
}