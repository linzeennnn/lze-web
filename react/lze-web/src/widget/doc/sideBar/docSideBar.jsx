import { useState } from 'react'
import SideBar from '../../../components/sideBar'
import CopyMove from './copyMove'
import Del from './del'
// import Move from './move'
import Paste from './paste'
import Relaod from './reload'
import Upload from './upload'
import Select from './select'
export default function DocSidepBar(){
    const[pastestatus,setPastestatus]=useState({
        type:"",
        status:false
    })
    const [copyList,setCopyList]=useState([])
    const [source,setSource]=useState("")
return (
    <SideBar>
      <Select/>
      <Upload />
      <Relaod />
      <Del />
      <CopyMove setPaste={setPastestatus} 
      setSource={setSource} setCopyList={setCopyList}/>
      <Paste paste={[pastestatus,setPastestatus]} 
      source={source}
      copyList={copyList}/>
    </SideBar>
)
}