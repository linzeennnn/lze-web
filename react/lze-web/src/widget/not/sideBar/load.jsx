import { list } from '../global';
import { AddMouseMenu, GetText } from '../../../utils/common';
import { useEffect } from 'react';
import { Icon } from '../../../utils/icon';

export default function Load() {

  const load = () => {
    list(); // 调用全局 list 方法
  };

  // 挂载时注册右键菜单
  useEffect(() => {
    AddMouseMenu({
      load: {
        name: GetText("refresh"),
        fun: load,
      }
    });
  }, []);

  return (
    <button
      className="btn side-btn"
      title={GetText("refresh")}
      onClick={load}
    >{Icon("load")}</button>
  );
}
