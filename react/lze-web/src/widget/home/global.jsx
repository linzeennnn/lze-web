import { create } from 'zustand';
import { notify } from '../public/notify.jsx'
import { GetTheme } from '../public/getTheme.jsx';
export const useGlobal = create((set, get) => {
  let userName = window.localStorage.getItem('userName') || 'visitor';
  let token = window.localStorage.getItem('token') || '';
  return {
    load:0,
    userName:"visitor",
    token:"",
    showBg: false,
    locked:true,
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
export function InitData(){
// 用户信息
    let userName=localStorage.getItem("userName")
    let token =localStorage.getItem("token")
    userName=userName?userName:"visitor";
    token=token?token:""; 
      useGlobal.setState({
        userName: userName,
        token: token
      })
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
    name=name?name:"visitor";
    token=token?token:"";
    fetch(window.location.origin+'/server/login/auth_status',
        {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            name,token
        })
    }
    )
    .then(res=>{
        if(!res.ok){
            if(res.status===401){
                notify("登录过期")
            }
            else{
                notify(res.status+"错误")
            }
            window.localStorage.setItem('userName',"visitor");
            window.localStorage.setItem('token',"");
            useGlobal.setState({userName:"visitor",token:"",load:useGlobal.getState().load+1})
            return
        }
        useGlobal.setState({load:useGlobal.getState().load+1})
        notify("登录用户:"+(name=="visitor"?"游客":name))
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