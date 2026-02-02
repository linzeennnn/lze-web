import ShowPath from './showPath';
import NewDirInput from './newDirInput';
import { useGlobal, list } from '../global';
import { AddMouseMenu, GetText } from '../../../utils/common';
import { useEffect } from 'react';
import { Icon } from '../../../utils/icon';

export default function TopBarBox({ createStatus }) {
  const [creating, setCreating] = createStatus;
  const upload = useGlobal((state) => state.upload);
  const nowPath = useGlobal((state) => state.nowPath);

  const goHome = () => {
    if (nowPath === '') return;
    list('');
  };

  // 注册右键菜单
  useEffect(() => {
    AddMouseMenu({
      home: {
        disable: nowPath === '',
        name: GetText("back_main_dir"),
        fun: goHome,
      }
    });
  }, [nowPath]);

  return (
    <div id="top-bar-box">
      {!creating && !upload.status && (
        <button
          id="home-icon"
          className="btn"
          title={GetText("back_main_dir")}
          onClick={goHome}
        >{Icon("home")}</button>
      )}

      {!creating && !upload.status && <ShowPath />}

      {upload.status && (
        <>
          <div id="progress" style={{ width: upload.percent }}></div>
          <span id="progress-text">{upload.percent}</span>
        </>
      )}

      {creating && !upload.status && (
        <NewDirInput setCreate={setCreating} />
      )}
    </div>
  );
}
