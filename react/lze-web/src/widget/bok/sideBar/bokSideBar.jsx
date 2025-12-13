import SideBar from '../../../components/sideBar'
import {list } from '../global'
import { GetText } from '../../../utils/common'
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