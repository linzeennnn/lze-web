import { create } from 'zustand';
import { notify } from '../../components/notify.jsx'
import { GetTheme } from '../../components/getTheme.jsx';
import { GetLangList} from '../../components/getLang.jsx';
export const useGlobal = create((set, get) => {
  let userName = window.localStorage.getItem('userName') || 'visitor';
  let token = window.localStorage.getItem('token') || '';
  return {
    load:0,
    userName:"visitor",
    token:"",
    showBg: false,
    locked:true,
    lang:{
      type:"",
      list:[],
      userSelect:""
    },
    theme:{
      mode:"",
      color:{
        home:"",
        doc:"",
        pic:"",
        tra:"",
        mon:"",
        not:"",
        bok:""
      },
      userSelect:""
    },
    listWin:{
      type:"",
      name:"",
      status:false
    },
    widgetData:{
      doc:[],
      pic:[],
      tra:[],
      mon:[],
      not:[],
      bok:[]
    },

    // 合并式更新
    setGlobal: (partial) => {
      set((state) => ({ ...state, ...partial }));
    },

    // 替代 getGlobal()
    getGlobal: () => get(),

    // 替代 setGlobal()
    replaceGlobal: (newState) => {
      set(() => ({ ...newState }));
    },
  };
});
// 获取文本
export  function GetText(str){
  return useGlobal.getState().lang.list[str]
}
export  async function InitData(){
  // 语言设置
  useGlobal.setState({
    lang:await GetLangList()
  })
// 用户信息
    let userName=localStorage.getItem("userName")
    let token =localStorage.getItem("token")
    userName=userName?userName:"visitor";
    token=token?token:""; 
      useGlobal.setState({
        userName: userName,
        token: token
      })
// 跳转设置
sessionStorage.setItem('home','true')
// 锁屏设置
if (sessionStorage.getItem('app') == 'true') {
  useGlobal.setState({ locked: false });
} else {
  useGlobal.setState({ locked: true });
      auth(userName,token)
}

  sessionStorage.setItem('app', 'false');
// 主题设置
const theme=GetTheme("home")
useGlobal.setState({
  theme:theme})
// widget
getWidgetData();
}
 function auth(name,token){
    const load=useGlobal.getState().load
    let user=name?name:"visitor";
    token=token?token:"";
    fetch(window.location.origin+'/server/login/auth_status',
        {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'authorization':"Bearer " +token,
            'x-user':user
        },
        body:JSON.stringify({
            name,token
        })
    }
    )
    .then(res=>{
        if(!res.ok){
            if(res.status===401){
                notify(GetText("log_outdate"))
            }
            else{
                notify(res.status)
            }
            window.localStorage.setItem('userName',"visitor");
            window.localStorage.setItem('token',"");
            useGlobal.setState({userName:"visitor",token:"",load:useGlobal.getState().load+1})
            return
        }
        useGlobal.setState({load:useGlobal.getState().load+1})
    })
}

function getWidgetData(){
    const user=useGlobal.getState().userName;
    const load=useGlobal.getState().load
    fetch(window.location.origin+'/server/home/widget',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({user})
    })
    .then(res=>res.json())
    .then(data=>{
        useGlobal.setState({widgetData:data,load:useGlobal.getState().load+1})
    })
}