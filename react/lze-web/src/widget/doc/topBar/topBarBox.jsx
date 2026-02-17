import NewDirInput from './newDirInput';
import { useGlobal, } from '../global';
import { AddMouseMenu, GetText } from '../../../utils/common';
import { useEffect } from 'react';
import { Icon } from '../../../utils/icon';
import ShowPath from '../../common/fileList/ShowPath';
import { LocalList } from '../../../utils/CacheList';
import { useFileCacheStore } from '../../../store/CacheList';
import { useUploadStore } from '../../../store/upload';

export default function TopBarBox({ createStatus }) {
  const [creating, setCreating] = createStatus;
  const upload=useUploadStore((state)=>state.upload)
  const current = useFileCacheStore((state) => state.fileCache).current;
  const goHome = () => {
    if (current ==0) return;
    LocalList(0)
  };

  // 注册右键菜单
  useEffect(() => {
    AddMouseMenu({
      home: {
        disable: current==0,
        name: GetText("back_main_dir"),
        fun: goHome,
      }
    });
  }, [current]);

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

      {!creating && !upload.status && <ShowPath/>}

      {upload.status && (
        <>
          <div id="progress" style={{ width: upload.percent+"%" }}></div>
          <span id="progress-text">{upload.percent+"%"}</span>
        </>
      )}

      {creating && !upload.status && (
        <NewDirInput setCreate={setCreating} />
      )}
    </div>
  );
}
