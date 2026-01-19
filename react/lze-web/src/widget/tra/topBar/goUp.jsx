import { useGlobal, list } from '../global';
import { AddMouseMenu, GetText } from '../../../utils/common';
import { useEffect } from "react";

export default function GoUp() {
  const nowPath = useGlobal((state) => state.nowPath);
  const parentPath = useGlobal((state) => state.parentPath);

  const isRoot = (nowPath === '/') || (nowPath === '');

  const goUp = () => {
    if (!isRoot) {
      list(parentPath);
    }
  };

  useEffect(() => {
    AddMouseMenu({
      goUp: {
        name: GetText("back"),
        fun: goUp,
        disable: isRoot
      }
    });
  }, [isRoot, parentPath]);

  return (
    <button
      id="go-up"
      className={(isRoot ? 'go-up-disable' : '') + ' btn top-bar-widget'}
      disabled={isRoot}
      title={isRoot ? '' : GetText("back")}
      onClick={goUp}
    ></button>
  );
}
