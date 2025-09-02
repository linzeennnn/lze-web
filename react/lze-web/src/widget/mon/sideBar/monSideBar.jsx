import SideBar from '../../../components/sideBar'
import Load from './load'
import Cmd from './cmd'
export default function MonSideBar(){
    return(
        <SideBar>
            <Cmd/>
            <Load/>
        </SideBar>
    )
}