import  SideBar  from "../../../components/sideBar";
import SwitchMediaBtn from "./switchMediaBtn";
import UploadBtn from "./uploadBtn"
import Load from "./load";
import Select from "./select";
import Del from "./del";
export default function PicSideBar() {
    return (
        <SideBar>
            <Select/>
            <UploadBtn/>
            <SwitchMediaBtn/>
            <Load/>
            <Del/>
        </SideBar>
    )
}