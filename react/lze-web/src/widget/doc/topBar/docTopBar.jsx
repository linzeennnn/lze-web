import TopBar from '../../public/topBar'
import TopBarBox from './topBarBox'
import GoUp from './goUp'
import NewDirBtn from './newDirBtn'
export default function DocTopBar(){
    return(
        <TopBar>
        <GoUp/>
        <TopBarBox/>
        <NewDirBtn/>
        </TopBar>
    )
}