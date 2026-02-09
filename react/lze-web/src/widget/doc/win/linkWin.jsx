import { WinBg } from "../../../components/winBg";
import { copy, GetText } from "../../../utils/common";
import { Icon } from "../../../utils/icon";
import { useGlobal } from "../global";
import FloatWin from '../../common/floatWin'
export default function LinkWin(){
    const setGlobal=useGlobal.setState
     const linkWin = useGlobal((state) => state.linkWin);
    return(
        <>
        <FloatWin 
        show={linkWin.show}
        setShow={()=>{setGlobal({linkWin:{
                link:"",
                show:false
            }})}}
        >
        <div id="link-win">
            <span
            onClick={()=>{openUrl()}}
            >{linkWin.link}</span>
            <button id="copy-link-btn"
            title={GetText("copy")}
            className="btn link-win-btn"
            onClick={()=>{coptLink()}}
            >{Icon("copy")}</button>
        </div>

        </FloatWin>
        </>
    )
}
function coptLink(){
    copy(useGlobal.getState().linkWin.link)
}
function openUrl(){
   window.open(useGlobal.getState().linkWin.link, "_blank");
}