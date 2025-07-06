import useGlobal from './global'; // 引入 zustand 的 store
import { notify } from '../public/notify';

// 扫描目录
export function list(path) {
  const sendData = { folder: path };

  const global = useGlobal.getState();

  useGlobal.setState({
    loading: true,
    showBg: true
  });

  fetch(`${window.location.origin}/server/doc/list`, {
    method: 'POST',
    body: JSON.stringify(sendData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      useGlobal.setState({
        fileList: data.filelist,
        nowPath: data.currentFolder,
        parentPath: data.parentFolder,
        loading: false,
        showBg: false,
        selected: [],
      });
    });
}

// 创建新目录
export function NewDir(folderName) {
  if (folderName.includes('/') || folderName.includes('\\')) {
    notify('文件夹名不能包含/或\\');
    return;
  } else if (folderName.length === 0) {
    notify('文件夹名不能为空');
    return;
  }

  const global = useGlobal.getState();

  const sendData = {
    folderName,
    nowpath: global.nowPath,
    user: global.userName,
    token: global.token,
  };

  useGlobal.setState({
    loading: true,
    showBg: true,
    creating: false
  });

  fetch(`${window.location.origin}/server/doc/new_folder`, {
    method: 'POST',
    body: JSON.stringify(sendData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 401) {
          notify('无创建文件夹权限');
        } else {
          notify(res.status + ' 错误');
        }

        useGlobal.setState({ creating: false });
        return;
      }

      notify('已创建 [' + folderName + ']');
      list(global.nowPath); // 重新加载列表
    });
}
