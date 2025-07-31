import SideBar from '../../../components/sideBar'
import { GetText, list } from '../global'
export default function BokSidepBar(){
return (
    <SideBar>
        <button className='btn side-btn' id='load' title={GetText("refresh")}
        onClick={()=>{
            list()
        }}
        ></button>
    </SideBar>
)
}