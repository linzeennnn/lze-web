import { list } from '../global';
import { AddMouseMenu, GetText } from '../../../utils/common';
import { useEffect } from 'react';

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
      id="load-btn"
      onClick={load}
    ></button>
  );
}
