import PicItem from "./picItem";
import { useGlobal } from "../global";
export default function VidPage({inner}){
    const vidList = useGlobal((state) => state.vidList);
    const pageNum = useGlobal((state) => state.pageNum);
    const nowPath = useGlobal((state) => state.nowPath);
    const url=inner.enable?
    inner.url
   : `${window.location.origin}/file/Pictures/`+nowPath+"/"

    return(
        <>{vidList[pageNum-1]?
            (vidList[pageNum-1].map((name,index)=>{
               return <PicItem url={url} name={name} type="vid" key={url+name} index={index}/>
            })):null
        }</>
    )
}