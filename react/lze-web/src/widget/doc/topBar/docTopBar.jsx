import TopBar from '../../../components/topBar'
import TopBarBox from './topBarBox'
import GoUp from './goUp'
import NewDirBtn from './newDirBtn'
import { useState } from 'react'
export default function DocTopBar(){

  const [creating, setCreating] = useState(false)
    return(
        <TopBar>
        <GoUp/>
        <TopBarBox createStatus={[creating, setCreating]}/>
        <NewDirBtn createStatus={[creating, setCreating]}/>
        </TopBar>
    )
}