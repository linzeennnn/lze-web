import { useLoadingStore } from "../../store/loading";
import { Loading } from "../loading";
import { WinBg } from "../winBg";

export default function LoadingPage(){
    const {show}=useLoadingStore()
    return(
        <WinBg showBg={show}>
            <Loading/>
        </WinBg>
    )
}