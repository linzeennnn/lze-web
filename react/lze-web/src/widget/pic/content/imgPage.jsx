import PicItem from "./picItem";
import { useGlobal } from "../global";
import { getNowPath } from "../../../store/CacheList";
export default function ImgPage({inner}){
    const imgList = useGlobal((state) => state.imgList);
    const pageNum = useGlobal((state) => state.pageNum);
    const url=inner.enable?
    inner.url
   : `${window.location.origin}/file/Pictures/`+getNowPath()+"/"
    return(
        <>{imgList[pageNum-1]?
            (imgList[pageNum-1].map((name,index)=>{
               return <PicItem url={url} name={name} type="img" key={url+name} index={index}/>
            })):null
        }</>
    )
}