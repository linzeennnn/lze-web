import { useGlobal} from "../global";
export default function UploadWin() {
    const dragWin=useGlobal((state) => state.dragWin); 
    return(
        <>
        <div id="drag-win"
        style={dragWin?{display:"flex"}:{display:"none"}}
        >
            <div></div>
        </div>
        </>
    )
}