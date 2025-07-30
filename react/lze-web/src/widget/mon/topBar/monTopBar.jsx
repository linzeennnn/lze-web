import TopBar from '../../../components/topBar'
import UserPro from './userPro'
import TimeBar from './timeBar'
import { useGlobal } from '../global'
export default function MonTopBar(){
    const userList=useGlobal((state)=>state.userList)
    return(
        <TopBar>
            <UserPro Mes={userList}/>
            <TimeBar/>
        </TopBar>
    )
}