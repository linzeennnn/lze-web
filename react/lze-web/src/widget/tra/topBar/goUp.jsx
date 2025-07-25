import {useGlobal,list} from '../global';

export default function GoUp() {
  const nowPath = useGlobal((state) => state.nowPath);
  const parentPath = useGlobal((state) => state.parentPath);

  const isRoot = (nowPath === '/')||(nowPath === '');

  return (
    <button
      id="go-up"
      className={(isRoot ? 'go-up-disable' : '') + ' btn top-bar-widget'}
      disabled={isRoot}
      title={isRoot ? '' : '返回上一级'}
      onClick={() => {
        if (!isRoot) {
          list(parentPath);
        }
      }}
    ></button>
  );
}
