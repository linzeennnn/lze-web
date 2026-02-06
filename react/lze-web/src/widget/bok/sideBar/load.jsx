import { list } from '../global';
import { AddMouseMenu, GetText } from '../../../utils/common';
import { useEffect } from 'react';
import { Icon } from '../../../utils/icon';
export default function load() {
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
      <button
        className='btn side-btn'
        title={GetText("refresh")}
        onClick={refresh}
      >{Icon("load")}</button>)
}