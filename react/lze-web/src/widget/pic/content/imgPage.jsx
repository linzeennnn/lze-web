import PicItem from "./picItem";
import { useGlobal } from "../global";
export default function ImgPage(){
    const imgList = useGlobal((state) => state.imgList);
    const pageNum = useGlobal((state) => state.pageNum);
    const nowPath = useGlobal((state) => state.nowPath);
    const url=`${window.location.origin}/file/Pictures/`+nowPath+"/"
    return(
        <>{imgList[pageNum-1]?
            (imgList[pageNum-1].map((name,index)=>{
               return <PicItem url={url+name} type="img" key={url+name}/>
            })):null
        }</>
    )
}