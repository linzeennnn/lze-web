import { useGlobal, list } from '../global';
import { AddMouseMenu, GetText } from '../../../utils/common';
import { useEffect } from 'react';
import { Icon } from '../../../utils/icon';

export default function GoUp() {
  const nowPath = useGlobal((state) => state.nowPath);
  const parentPath = useGlobal((state) => state.parentPath);

  const isRoot = (nowPath === '/') || (nowPath === '');

  const goUp = () => {
    if (isRoot) return;
    list(parentPath);
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

  return (
    <button
      id="go-up"
      className={(isRoot ? 'go-up-disable' : '') + ' btn'}
      disabled={isRoot}
      title={isRoot ? '' : GetText("back")}
      onClick={goUp}
    >{Icon("goUp")}</button>
  );
}
