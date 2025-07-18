import { SideBar } from "../../public";
import Add from "./add";
import Load from "./load";
import Upload from "./upload";
export default function NotSideBar(){
    return(
        <SideBar>
            <Add/>
            <Upload/>
            <Load/>
        </SideBar>
    )
}