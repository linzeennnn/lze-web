import { WinBg } from "../../../components/winBg";
import { copy, GetText } from "../../../utils/common";
import { Icon } from "../../../utils/icon";
import { useGlobal } from "../global";
export default function LinkWin(){
    const setGlobal=useGlobal.setState
     const linkWin = useGlobal((state) => state.linkWin);
    return(
        <>
        <WinBg showBg={linkWin.show}>
        <div id="link-win">
            <button id="close-link-btn"
            onClick={()=>{setGlobal({linkWin:{
                link:"",
                show:false
            }})}}
            title={GetText("close")}
            className="btn link-win-btn">{Icon("no")}</button>
            <span
            onClick={()=>{openUrl()}}
            >{linkWin.link}</span>
            <button id="copy-link-btn"
            title={GetText("copy")}
            className="btn link-win-btn"
            onClick={()=>{coptLink()}}
            >{Icon("copy")}</button>
        </div>
        </WinBg>
        </>
    )
}
function coptLink(){
    copy(useGlobal.getState().linkWin.link)
}
function openUrl(){
   window.open(useGlobal.getState().linkWin.link, "_blank");
}