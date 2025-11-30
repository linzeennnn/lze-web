import SideBar from '../../../components/sideBar'
import Load from './load'
import Cmd from './cmd'
import Logout from './logout'
export default function MonSideBar(){
    return(
        <SideBar>
            <Cmd/>
            <Logout/>
            <Load/>
        </SideBar>
    )
}