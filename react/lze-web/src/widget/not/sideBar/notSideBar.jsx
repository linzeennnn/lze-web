import { SideBar } from "../../public";
import Add from "./add";
import Load from "./load";
import UploadBtn from "./upload";
export default function NotSideBar(){
    return(
        <SideBar>
            <Add/>
            <UploadBtn/>
            <Load/>
        </SideBar>
    )
}