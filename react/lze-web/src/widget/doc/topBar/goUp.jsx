import {useGlobal,list, GetText} from '../global';

export default function GoUp() {
  const nowPath = useGlobal((state) => state.nowPath);
  const parentPath = useGlobal((state) => state.parentPath);

  const isRoot = (nowPath === '/')||(nowPath === '');

  return (
    <button
      id="go-up"
      className={(isRoot ? 'go-up-disable' : '') + ' btn'}
      disabled={isRoot}
      title={isRoot ? '' : GetText("back")}
      onClick={() => {
        if (!isRoot) {
          list(parentPath);
        }
      }}
    ></button>
  );
}
