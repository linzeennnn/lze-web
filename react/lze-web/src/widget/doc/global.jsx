import { create } from 'zustand';
// 全局变量
export const useGlobal = create((set, get) => ({
  userName: window.localStorage.getItem('userName'),
  token: window.localStorage.getItem('token'),
  nowPath: '/',
  parentPath: '/',
  fileList: [],
  uploading: false,
  showBg: false,
  loading: false,
  upload:{
    win:false,
    status:false,
    percent:"0%"
  },
  selected: [],
  docUrl:`${window.location.origin}/server/doc/`,
  setGlobal: (partial) => {
    set((state) => ({ ...state, ...partial }));
  },
  replaceGlobal: (newState) => {
    set(() => ({ ...newState }));
  },
  getGlobal: () => get(),
}));


// 扫描目录
export function list(path) {
  const sendData = { folder: path };
  const url = useGlobal.getState().docUrl;

  loadPage(true)

  fetch(`${url}list`, {
    method: 'POST',
    body: JSON.stringify(sendData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      loadPage(false)
      useGlobal.setState({
        fileList: data.filelist,
        nowPath: data.currentFolder,
        parentPath: data.parentFolder,
        selected: [],
      });
    });
}

// 加载页面
export function loadPage(isLoad){
  useGlobal.setState({
    loading: isLoad,
    showBg: isLoad
  });
}