import { useGlobal,list, GetText } from "../global";
export default function Load() {
    const nowPath = useGlobal((state) => state.nowPath);
    return (
        <>
            <button className="btn side-btn" id="load" 
            title={GetText("refresh")} onClick={()=>{list(nowPath)}}
            ></button>
        </>
    )
}