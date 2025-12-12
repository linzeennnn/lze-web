import { create } from 'zustand';
import { notify } from '../../utils/common.js'
import { GetTheme } from '../../components/getTheme.jsx';
// import { GetText } from '../../utils/common.js';
import { DisableZoom } from '../../components/pub.jsx';
import { CheckLang } from '../../utils/common.js';
export const useGlobal = create((set, get) => {
  let userName = window.localStorage.getItem('userName') || 'guest';
  let token = window.localStorage.getItem('token') || '';
  return {
    load:0,
    userName:"guest",
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
// 初始化
export  async function InitData(){
  DisableZoom()
// 拉取语言包
await CheckLang(true)
// 用户信息
    let userName=localStorage.getItem("userName")
    let token =localStorage.getItem("token")
    userName=userName?userName:"guest";
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
GetWidgetData();
}
 function auth(name,token){
    const load=useGlobal.getState().load
    let user=name?name:"guest";
    token=token?token:"";
    fetch(window.location.origin+'/server/login/auth_status',
        {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'authorization':"Bearer " +token
        },
        body:JSON.stringify({
            name,token
        })
    }
    )
    .then(res=>{
        if(!res.ok){
            if(res.status===401){
                notify.err(GetText("log_outdate"))
            }
            else{
                notify.err(res.status)
            }
            window.localStorage.setItem('userName',"guest");
            window.localStorage.setItem('token',"");
            useGlobal.setState({userName:"guest",token:"",load:useGlobal.getState().load+1})
            return
        }
        useGlobal.setState({load:useGlobal.getState().load+1})
    })
}

export function GetWidgetData(){
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
// ///////////////////////////获取密钥////////////////////////////////
async function GetKey() {
    try {
        // 构建 URL
        const url = window.location.origin + '/server/login/login';
        // 发送请求
        const response = await fetch(url, {
            method: 'GET', // 或 'POST' 根据实际接口
            headers: {
                'Content-Type': 'text/plain'
            }
        });

        // 获取响应文本
        const text = await response.text();

        // Base64 解码
        const decoded = atob(text);

        return decoded;
    } catch (error) {
        console.error('Error fetching key:', error);
        return null;
    }
}

////////////////////////////////////////加密用户名密码/////////////////////////////////////////
export async function encodeUserMes(str) {
  let key= await GetKey();
    let res = [];
    for (let i = 0; i < str.length; i++) {
        res.push(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(String.fromCharCode(...res));
}