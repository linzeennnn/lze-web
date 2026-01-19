import SideBar from '../../../components/sideBar';
import { list } from '../global';
import { AddMouseMenu, GetText } from '../../../utils/common';
import { useEffect } from 'react';

export default function BokSidepBar() {
  // 点击刷新逻辑
  const refresh = () => {
    list();
  };

  // 组件挂载时添加右键菜单
  useEffect(() => {
    AddMouseMenu({
      refresh: {
        name: GetText("refresh"),
        fun: refresh,
      }
    });
  }, []);

  return (
    <SideBar>
      <button
        className='btn side-btn'
        id='load'
        title={GetText("refresh")}
        onClick={refresh}
      ></button>
    </SideBar>
  );
}
