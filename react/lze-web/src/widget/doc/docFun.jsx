import { setGlobal,getGlobal } from "./global";
// 扫描目录
export function list(path) {
  const sendData={
    folder:path
  }
    let tmp=getGlobal()
    fetch(`${window.location.origin}/server/doc/list`, {
      method: 'POST',
      body: JSON.stringify(sendData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())  
      .then((data) => {
       setGlobal({
        ...tmp,
        fileList: data.filelist,
        nowPath: data.currentFolder,
        parentPath: data.parentFolder,
       }
       )
      });
}

