import { create } from 'zustand';
import { PageCom } from '../../components/pageCom';
// 全局变量
export const useGlobal = create((set, get) => {
  const storedUser = window.localStorage.getItem('userName');
  const storedToken = window.localStorage.getItem('token');
  return {
    userName: storedUser,
    token: storedToken,
    nowuser: storedUser?.trim() || 'visitor',
    showBg: false,
    loading: false,
    controlList: null,
    langList:[],
    userList: null,
    showCmd:false,
    theme:{
      mode:"",
      color:{
        mon:""
      }
    },
    monUrl: `${window.location.origin}/server/mon/`,
    setGlobal: (partial) => {
      set((state) => ({ ...state, ...partial }));
    },
    replaceGlobal: (newState) => {
      set(() => ({ ...newState }));
    },
    getGlobal: () => get(),
  };
});

// 获取文本
export  function GetText(str){
  return useGlobal.getState().langList[str]
}
// 初始化
export function InitData(){
PageCom(useGlobal.setState,"mon")
  list()
}
// 加载页面
export function loadPage(isLoad){
  useGlobal.setState({
    loading: isLoad,
    showBg: isLoad
  });
}
//获取配置
export function list(){
  loadPage(true)
const url =useGlobal.getState().monUrl+'list'
fetch(url,{
    method:'GET',
  headers:{
    'Content-Type':'application/json'
  }
}).then(res=>res.json())
.then(data=>{
    useGlobal.setState({controlList:data.control,userList:data.user})
  loadPage(false)
})
}