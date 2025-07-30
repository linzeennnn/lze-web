import { useState } from 'react'
import SideBar from '../../../components/sideBar'
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
    const [copyList,setCopyList]=useState([])
return (
    <SideBar>
      <Upload />
      <Relaod />
      <Del />
        <Copy setPaste={setPastestatus} setCopyList={setCopyList}/>
      <Move setPaste={setPastestatus} setCopyList={setCopyList}/>
      <Paste paste={[pastestatus,setPastestatus]} copyList={copyList}/>
    </SideBar>
)
}