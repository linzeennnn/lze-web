import { create } from 'zustand';
import { notify } from '../public/notify';
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


export async function Upload(file) {
  const global=useGlobal.getState()
  const user=global.userName
  const token=global.token
  const url=global.docUrl+"upload_file"
  const nowPath=global.nowPath
  const upload=global.upload
  let setGlobal=useGlobal.setState
  let sendSize=0;
  let start = 0;
  const chunkSize = getChunkSize(file.size);
  while (start < file.size) {
    const totalChunks = Math.ceil(file.size / chunkSize);
    const chunk = file.slice(start, start + chunkSize);
    const curChunk=Math.floor(start / chunkSize);
    const formData = new FormData();
    let percent
    formData.append('file', chunk);
    formData.append('fileName', file.name);
    formData.append('totalChunks', totalChunks);
    formData.append('currentChunk',curChunk)
    formData.append('user', user);
    formData.append('token', token);
    formData.append('nowpath',nowPath)
    var xhr = new XMLHttpRequest();
    xhr.upload.onprogress = function(event) {
    if (event.lengthComputable) {
      if(event.loaded>=chunkSize){
        console.log(11111);
        
      sendSize+=event.loaded;
     percent = Math.ceil((sendSize/ file.size )*100);
      }
      else{
     percent = Math.ceil(((sendSize + event.loaded)/ file.size )*100);
      }
      percent=percent>100?100:percent
     const percentStr=percent+"%"
      console.log("上传进度：" + percentStr);
      setGlobal({upload:{
        ...upload,
        percent:percentStr
      }})
    }
  };
    xhr.onreadystatechange = function() {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    if (xhr.status != 200) {
        if(xhr.status==401){
          notify("没有上传权限")
        }
        else{
          notify("上传失败"+xhr.status+"错误")

          console.log("上传失败"+xhr.status+"错误")
        }
        return;
      } 
  }
};

    try{
      xhr.open("POST", url, true);
      xhr.send(formData);
      start += chunkSize;
  }catch (error) {
      console.error('Error uploading chunk:', error);
      return;
    }
}
}
// 获取块大小
function getChunkSize(fileSize) {
    const mb=1024*1024
    if (fileSize <= 1024 * mb) {
        return 10 * mb;
    } else if (fileSize <= 5120 * mb&&fileSize>1024 * mb) {
        return 50 * mb;
    } else {
        return 100 * mb;
    }
}