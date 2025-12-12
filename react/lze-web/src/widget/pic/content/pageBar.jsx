import { useGlobal } from "../global";
import { notify } from "../../../utils/common";
import { GetText } from "../../../utils/common";
import { useState } from "react";
export default function PageBar(){
    const [inputPage, setInputPage] = useState("")
    const vidList = useGlobal((state) => state.vidList);
    const imgList = useGlobal((state) => state.imgList);
    const pageNum = useGlobal((state) => state.pageNum);
    const imgPage = useGlobal((state) => state.imgPage);
    let totalPage=imgPage?imgList.length:vidList.length
    const setGlobal = useGlobal.setState
    const jumpPage=(num)=>{
        num = Number(num)
        if(num>=1&&num<=totalPage&&totalPage!=1){
            setGlobal({pageNum:num})}
        else if(num==pageNum)
        {}
        else
            notify.err(GetText("page_num")+GetText("not_correct"))
    }
    return(
        <div id="page-bar">
            <button className="btn" id="last-page"
            onClick={()=>{jumpPage(pageNum==1?totalPage:pageNum-1)}}
            ></button>
            <span id="page-num">{pageNum+"/"+(totalPage==0?1:totalPage)}</span>
            <div id="jump-page">
            <input id="page-input" value={inputPage}  type="text" 
            placeholder={GetText("page_num")}
            onChange={(e) => setInputPage(e.target.value)}
            onKeyDown={(e)=>{
                if(e.key=="Enter"){
                    jumpPage(inputPage)
                    setInputPage("")
                }
            }}
            >
                
            </input>
            <button className="btn" id="jump-btn"
                onClick={()=>{jumpPage(inputPage)
                    setInputPage("")
                }} title={GetText("jump")}
                ></button>
                </div>
            <button className="btn" id="next-page"
            onClick={()=>{jumpPage(pageNum==totalPage?1:pageNum+1)}}
            ></button>
        </div>
    )
}