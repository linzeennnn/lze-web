import { SideBar } from "../../public";
import SwitchMediaBtn from "./switchMediaBtn";
import UploadBtn from "./uploadBtn"
import Load from "./load";
export default function PicSideBar() {
    return (
        <SideBar>
            <UploadBtn/>
            <SwitchMediaBtn/>
            <Load/>
        </SideBar>
    )
}