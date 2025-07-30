import SideBar from '../../../components/sideBar'
import Load from './load'
import Del from './del'
import Recover from './recover'
export default function TraSideBar(){
    return(
        <SideBar>
            <Load/>
            <Del/>
            <Recover/>
        </SideBar>
    )
}