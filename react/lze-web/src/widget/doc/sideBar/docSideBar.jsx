import { useState } from 'react'
import SideBar from '../../public/sideBar'
import Copy from './copy'
import Del from './del'
import Move from './move'
import Paste from './paste'
import Relaod from './reload'
import Upload from './upload'
export default function DocSidepBar(){
    const[pastestatus,setPastestatus]=useState({
        type:"",
        status:false
    })
return (
    <SideBar>
      <Upload />
      <Relaod />
      <Del />
        <Copy setPaste={setPastestatus}/>
      <Move setPaste={setPastestatus}/>
      <Paste paste={[pastestatus,setPastestatus]}/>
    </SideBar>
)
}