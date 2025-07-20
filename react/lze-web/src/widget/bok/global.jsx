import { create } from 'zustand';
import { notify } from '../public/notify';
// 全局变量
export const useGlobal = create((set, get) => ({
  userName: window.localStorage.getItem('userName'),
  token: window.localStorage.getItem('token'),
  showBg: false,
  loading: false,
  bokList:[],
  bokUrl:`${window.location.origin}/server/bok/`,
  setGlobal: (partial) => {
    set((state) => ({ ...state, ...partial }));
  },
  replaceGlobal: (newState) => {
    set(() => ({ ...newState }));
  },
  getGlobal: () => get(),
}));
// 扫描目录
export function list(){
  loadPage(true)
const url =useGlobal.getState().bokUrl+'list'
const edit =useGlobal.getState().edit
fetch(url,{
    method:'GET',
  headers:{
    'Content-Type':'application/json'
  }
}).then(res=>res.json())
.then(data=>{
    useGlobal.setState({
      bokList:data,
    })
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
