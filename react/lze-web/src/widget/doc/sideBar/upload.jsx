import { GetText, useGlobal } from "../global"
export default function Upload(){
    const setGlobal=useGlobal.setState
     const upload = useGlobal((state) => state.upload);
    return (
        <>
    <button id="upload" className="btn side-btn"
    title={GetText("upload")} onClick={()=>{
        setGlobal({upload:{
            ...upload,
            win:true
        }})
    
    }}
    ></button>
   
    </>
)
}