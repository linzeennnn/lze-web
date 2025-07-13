import { useGlobal } from "../global";
export default function SwitchMediaBtn() {
    const setGlobal = useGlobal.setState
    const pageNum = useGlobal((state) => state.pageNum);
    const imgPage = useGlobal((state) => state.imgPage);
    const changePage=(type)=>{
        switch(type){
            case "img":
                setGlobal({imgPage:true,pageNum:imgPage?pageNum:1})
                break;
            case "vid":
                setGlobal({imgPage:false,pageNum:imgPage?1:pageNum})
                break;
        }
    }
    return (
        <>
            <button className="btn side-btn" id="img-btn" 
            title="图片" onClick={()=>{changePage("img")}}
            ></button>
            <button className="btn side-btn" id="vid-btn" 
            title="视频" onClick={()=>{changePage("vid")}}
            ></button>
        </>
    )
}