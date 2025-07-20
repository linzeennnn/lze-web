import SideBar from '../../public/sideBar'
import { list } from '../global'
export default function BokSidepBar(){
return (
    <SideBar>
        <button className='btn side-btn' id='load' title='刷新'
        onClick={()=>{
            list()
        }}
        ></button>
    </SideBar>
)
}