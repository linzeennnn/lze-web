import TopBar from '../../public/topBar'
import GoUp from './goUp'
import ShowPath from './showPath'
import GoHome from './goHome'
import { useState } from 'react'
export default function TraTopBar(){

  const [creating, setCreating] = useState(false)
    return(
        <TopBar>
        <GoUp/>
        <ShowPath/>
        <GoHome/>
        </TopBar>
    )
}