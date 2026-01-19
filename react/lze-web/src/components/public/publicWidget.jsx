import ConfirmWin from "./confirmWin"
import LoadingPage from "./loadingPage"
import Notify from "./notify"
import Tooltip from "./tooltip"
import MouseMenu from "./mouseMenu"
export default function PublicWidget(){
return (
    <>
    <Notify/>
    <Tooltip/>
    <ConfirmWin/>
    <LoadingPage/>
    <MouseMenu/>
    </>
)
}
