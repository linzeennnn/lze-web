import { useGlobal } from "../global"
import { GetText } from '../../../utils/common';
export default function Logout(){
    const showLogout=useGlobal(state=>state.showLogout)
    return(
        <button className="btn side-btn" id="logout-btn" title={GetText("logout")}
        onClick={()=>{
            useGlobal.setState({showLogout:true})
            
        }}
        ></button>
    )
}