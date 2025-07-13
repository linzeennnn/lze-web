import { TopBar } from "../../public";
import HomePic from "./homePic";
import TopBarBox from "./topBarBox"
import DirList from "./dirList";
export default function PicTopBar() {
    return (
        <TopBar>
            <HomePic/>
            <TopBarBox/>
            <DirList/>
        </TopBar>
    )
}