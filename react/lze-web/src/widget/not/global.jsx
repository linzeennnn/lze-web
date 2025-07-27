import { create } from 'zustand';
import { GetTheme } from '../public/getTheme';
import {notify} from "../public/notify";
// 全局变量
export const useGlobal = create((set, get) => ({
  userName: window.localStorage.getItem('userName'),
  token: window.localStorage.getItem('token'),
  uploading: false,
  showBg: false,
  loading: false,
  dragWin:false,
  notList:[],
  edit:{
    mode:false,
    title:"",
    text:"",
    type:""
  },
    theme:{
      mode:"",
      color:{
        not:""
      }
    },
  upload:{
    status:false,
    percent:"0%"
  },
  notUrl:`${window.location.origin}/server/not/`,
  setGlobal: (partial) => {
    set((state) => ({ ...state, ...partial }));
  },
  replaceGlobal: (newState) => {
    set(() => ({ ...newState }));
  },
  getGlobal: () => get(),
}));
// 初始化
export function InitData(){
 const theme=GetTheme()
  useGlobal.setState({
    theme:theme
  })
  list()
}
//初始化编辑数据
function init_edit(){
  const edit = useGlobal.getState().edit;
  const setGlobal = useGlobal.setState;
  setGlobal({edit:{
    mode:false,
    title:"",
    text:"",
    type:""
  }})
}
// 扫描目录
export function list(){
  loadPage(true)
const url =useGlobal.getState().notUrl+'list'
const edit =useGlobal.getState().edit
fetch(url,{
    method:'GET',
  headers:{
    'Content-Type':'application/json'
  }
}).then(res=>res.json())
.then(data=>{
    useGlobal.setState({
      notList:data,
    })
    init_edit()
  loadPage(false)
})
}
// 保存文件
export function Save_note(newTitle,newContent){
    loadPage(true)
    const user=useGlobal.getState().userName
    const token=useGlobal.getState().token
    const edit=useGlobal.getState().edit
    const oldTitle=edit.title
    newTitle=newTitle==""?"new_note":newTitle
    let api;
    switch(edit.type){
      case "edit":
        api="edit"
        break;
      case "add":
        api="add"
        break;
    }
    const url=useGlobal.getState().notUrl+api
    const send_data={user,token,oldTitle,newTitle,newContent}
    fetch(url,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(send_data)
    }).then((res) => {
        if(!res.ok){
            if(res.status===401){
                notify("无权限")
            }
            else{
                notify("保存失败"+res.status+"错误")
            }
            loadPage(false)
            return
        }
        notify("保存成功")
        loadPage(false)
        list()
    })
}
// 加载页面
export function loadPage(isLoad){
  useGlobal.setState({
    loading: isLoad,
    showBg: isLoad
  });
}
// 上传文件
export async function Upload(file, uploadData) {
  const setGlobal = useGlobal.setState;
  const upload = useGlobal.getState().upload;
  
  if (file.size === 0) {
    notify("文件为空，无法上传");
    setGlobal({
      upload: {
        ...upload,
        status: false
      }
    });
    return;
  }

  if (file.size > 1024 * 1024) { 
    notify("文件不允许超过1MB");
    setGlobal({
      upload: {
        ...upload,
        status: false
      }
    });
    return;
  }

  const isTextFile = await isText(file);
  if (!isTextFile) {
    notify("仅支持上传文本文件");
    setGlobal({
      upload: {
        ...upload,
        status: false
      }
    });
    return;
  }

  let tmp_send_size = 0;
  let percent = "";
  const url = useGlobal.getState().notUrl + 'upload';
  const xhr = new XMLHttpRequest();
  const formData = new FormData();
  const user = useGlobal.getState().userName;
  const token = useGlobal.getState().token;
    formData.append('new_note', file);
  formData.append("token", token);
  formData.append("user", user);

  xhr.upload.onprogress = function (event) {
    if (event.lengthComputable) {
      uploadData.sendSize = event.loaded + uploadData.sendSize - tmp_send_size;
      tmp_send_size = event.loaded;
      percent = Math.floor((uploadData.sendSize / uploadData.totalSize) * 100);
      setGlobal({
        upload: {
          ...upload,
          percent: percent + '%',
        },
      });
    }
  };

  xhr.onload = function () {
    if (xhr.status !== 200) {
      if (xhr.status === 401) {
        notify("无上传权限");
      } else {
        notify("上传失败：" + xhr.status + " 错误:" + xhr.responseText);
      }
      setGlobal({
        upload: {
          ...upload,
          status: false,
        },
      });
      return;
    }

    if (uploadData.sendSize >= uploadData.totalSize) {
      setGlobal({
        upload: {
          ...upload,
          status: false,
        },
      });
      notify("上传完成");
      list();
    }
  };

  xhr.onerror = function () {
    notify("上传出错");
    setGlobal({
      upload: {
        ...upload,
        status: false,
      },
    });
  };

  xhr.open("POST", url);
  xhr.send(formData);
}

//拖拽上传
export function DragOver(e) {
  
    useGlobal.setState({ dragWin: true });
    e.stopPropagation();
    e.preventDefault();
}
export function DragLeave(e) {
    useGlobal.setState({ dragWin: false });
    e.stopPropagation();
    e.preventDefault();
}
export function Drop(e) {
  const global = useGlobal.getState();
  const upload = global.upload;
  const setGlobal = useGlobal.setState;

  setGlobal({ dragWin: false });

  e.stopPropagation();
  e.preventDefault();

  const items = e.dataTransfer.items;
  const fileList = [];
  let totalSize = 0;

  let pending = 0;

  function handleItem(item) {
    const entry = item.webkitGetAsEntry();
    if (!entry) return;

    if (entry.isDirectory) {
      notify("不支持上传文件夹");
      return;
    }

    if (entry.isFile) {
      pending++;
      entry.file((file) => {
        fileList.push(file);
        totalSize += file.size;
        pending--;
        maybeUpload();
      });
    }
  }

  function maybeUpload() {
    if (pending === 0) {
      if (fileList.length === 0) {
        notify("没有可上传的文件");
        return;
      }

      setGlobal({
        upload: {
          ...upload,
          status: true,
          win: false,
        },
      });

      const uploadData = {
        totalSize: totalSize,
        sendSize: 0,
      };

      fileList.forEach((file) => {
        Upload(file, uploadData); // type 参数已从 Upload 中移除
      });
    }
  }

  for (let i = 0; i < items.length; i++) {
    handleItem(items[i]);
  }
}
function isText(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    const sampleSize = 512;
    const blob = file.slice(0, sampleSize);

    reader.onload = () => {
      const text = reader.result;
      let nonPrintable = 0;
      for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i);
        // 排除换行、回车、制表符
        if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
          nonPrintable++;
        }
      }
      const ratio = nonPrintable / text.length;
      resolve(ratio < 0.1); // 不可打印字符比例小于 10% 认为是文本
    };

    reader.onerror = () => {
      resolve(false);
    };

    reader.readAsText(blob); // 使用 UTF-8 解码尝试读取为文本
  });
}
