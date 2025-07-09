import { useGlobal } from "../global"
export default function Upload(){
    const setGlobal=useGlobal.setState
     const upload = useGlobal((state) => state.upload);
    return (
        <>
    <button id="upload" className="btn side-btn"
    title="上传" onClick={()=>{
        setGlobal({upload:{
            ...upload,
            win:true
        }})
    console.log(JSON.stringify(upload));
    
    }}
    ></button>
   
    </>
)
}