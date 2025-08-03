import { create } from 'zustand';
import { PageCom } from '../../components/pageCom';
import {notify} from "../../components/notify";
// 全局变量
export const useGlobal = create((set, get) => ({
  userName: window.localStorage.getItem('userName'),
  token: window.localStorage.getItem('token'),
  uploading: false,
  showBg: false,
  loading: false,
  langList:[],
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
// 获取文本
export  function GetText(str){
  return useGlobal.getState().langList[str]
}
// 初始化
export function InitData(){
PageCom(useGlobal.setState,"not")
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
    method:'GET'
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
    const url=useGlobal.getState().notUrl+edit.type
    const send_data={user,token,oldTitle,newTitle,newContent}
    fetch(url,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ token,
            'x-user': user
        },
        body: JSON.stringify(send_data)
    }).then((res) => {
        if(!res.ok){
            if(res.status===401){
                notify(GetText("no_per"))
            }
            else{
                notify(+":"+res.status)
            }
            loadPage(false)
            return
        }
        notify(GetText("op_com"))
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
    notify(GetText("error") + GetText("is_empty"));
    setGlobal({ upload: { ...upload, status: false } });
    return;
  }

  if (file.size > 1024 * 1024) { 
    notify(GetText("no_more_than") + "1MB");
    setGlobal({ upload: { ...upload, status: false } });
    return;
  }

  const isTextFile = await isText(file);
  if (!isTextFile) {
    notify(file.name + GetText("not_text"));
    setGlobal({ upload: { ...upload, status: false } });
    return;
  }

  let tmp_send_size = 0;
  let percent = "";
  const url = useGlobal.getState().notUrl + "upload";
  const xhr = new XMLHttpRequest();
  const formData = new FormData();
  const user = useGlobal.getState().userName;
  const token = useGlobal.getState().token;

  formData.append("new_note", file);

  xhr.upload.onprogress = function (event) {
    if (event.lengthComputable) {
      uploadData.sendSize = Math.min(event.loaded, file.size) + uploadData.sendSize - tmp_send_size;
      tmp_send_size = event.loaded;
      percent = Math.floor((uploadData.sendSize / uploadData.totalSize) * 100);
      setGlobal({
        upload: {
          ...upload,
          percent: percent + "%",
        },
      });
    }
  };

  xhr.onload = function () {
    if (xhr.status !== 200) {
      if (xhr.status === 401) {
        notify(GetText("no_per"));
      } else {
        notify(GetText("error") + xhr.status);
      }
      setGlobal({ upload: { ...upload, status: false } });
      return;
    }

    if (uploadData.sendSize >= uploadData.totalSize) {
      setGlobal({ upload: { ...upload, status: false } });
      notify(GetText("op_com"));
      list();
    }
  };

  xhr.onerror = function () {
    notify(GetText("error"));
    setGlobal({ upload: { ...upload, status: false } });
  };

  xhr.open("POST", url);

  // 将 user 和 token 作为 Header 发送
  xhr.setRequestHeader("authorization", "Bearer " + token);
  xhr.setRequestHeader("x-user", user);

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
      notify(GetText("not_support_type"));
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

async  function maybeUpload() {
    if (pending === 0) {
      if (fileList.length === 0) {
        notify(GetText("no_select_file"));
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
 const permitted = await UploadPermit();
            if (!permitted) {
              return;
            }
            console.log(22222);
            
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
// 检查是否能有上传权限
export async function UploadPermit(){
  const user=useGlobal.getState().userName
  const token=useGlobal.getState().token
  const upload = useGlobal.getState().upload;
  const url=window.location.origin+"/server/login/upload"

    const res =  await  fetch(url,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`,
            'x-user': user
        },
        body: JSON.stringify({
            appType:"not",fileType:""
        })
    })
    
        if(res.ok){
            return true
        }else{
            if(res.status==401){
                notify(GetText("no_per"))
            }
            else{
                notify(GetText("error")+":"+res.status)
            }
           useGlobal.setState({
              upload: {
                ...upload,
                status: false
              }
            })
            return false
        }
}