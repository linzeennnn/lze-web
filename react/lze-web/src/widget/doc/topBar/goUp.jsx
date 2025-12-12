import {useGlobal,list} from '../global';
import { GetText } from '../../../utils/common';

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
