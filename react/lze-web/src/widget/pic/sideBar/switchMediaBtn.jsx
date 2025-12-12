import {  useGlobal } from "../global";
import { GetText } from "../../../utils/common";
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
            <button className={"btn side-btn "+(imgPage?"media-selected":"")} id="img-btn" 
            title={GetText("image")} onClick={()=>{changePage("img")}}
            ></button>
            <button className={"btn side-btn "+(!imgPage?"media-selected":"")} id="vid-btn" 
            title={GetText("video")} onClick={()=>{changePage("vid")}}
            ></button>
        </>
    )
}