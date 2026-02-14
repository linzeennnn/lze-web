import TopBar from '../../../components/topBar'
import TopBarBox from './topBarBox'
import NewDirBtn from './newDirBtn'
import GoUp from '../../common/fileList/goUp';

import { useState } from 'react'
export default function DocTopBar(){


  // 只在挂载时注册右键菜单
 

  const [creating, setCreating] = useState(false)
    return(
        <TopBar>
        <GoUp/>
        <TopBarBox createStatus={[creating, setCreating]}/>
        <NewDirBtn createStatus={[creating, setCreating]}/>
        </TopBar>
    )
}