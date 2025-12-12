import { create } from 'zustand';
import { PageCom } from '../../components/pageCom';
import { notify } from '../../components/public/notify';
// 全局变量
export const useGlobal = create((set, get) => ({
  userName: window.localStorage.getItem('userName'),
  token: window.localStorage.getItem('token'),
  showBg: false,
  loading: false,
  langList:[],
  bokList:[],
  bokUrl:`${window.location.origin}/server/bok/`,
    theme:{
      mode:"",
      color:{
        bok:""
      }
    },
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
PageCom(useGlobal.setState,"bok")
  list()
}
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
                notify(GetText("no_per"))
            }
            else{
                notify(GetText("error")+":"+res.status)
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
