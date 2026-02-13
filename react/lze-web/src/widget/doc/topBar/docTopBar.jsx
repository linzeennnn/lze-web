import TopBar from '../../../components/topBar'
import TopBarBox from './topBarBox'
import NewDirBtn from './newDirBtn'
import { useGlobal, list, LocalList } from '../global';
import { AddMouseMenu, GetText } from '../../../utils/common';
import { useEffect } from 'react';
import GoUp from '../../common/fileList/goUp';

import { useState } from 'react'
export default function DocTopBar(){
  const nowPath = useGlobal((state) => state.nowPath);
  const parentPath = useGlobal((state) => state.parentPath);

  const isRoot = (nowPath === '/') || (nowPath === '');

  const goUp = () => {
    if (isRoot) return;
    const index=useGlobal.getState().CacheList.current;
    LocalList(index-1)
  };

  // 只在挂载时注册右键菜单
  useEffect(() => {
    AddMouseMenu({
      goUp: {
        disable:isRoot,
        name: GetText("back"),
        fun: goUp,
      }
    });
  }, [isRoot,parentPath]);

  const [creating, setCreating] = useState(false)
    return(
        <TopBar>
        <GoUp isRoot={isRoot} goUp={goUp}/>
        <TopBarBox createStatus={[creating, setCreating]}/>
        <NewDirBtn createStatus={[creating, setCreating]}/>
        </TopBar>
    )
}