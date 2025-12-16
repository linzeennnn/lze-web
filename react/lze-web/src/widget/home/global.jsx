import { create } from 'zustand';
import { notify,GetText } from '../../utils/common.js'
import { GetTheme } from '../../components/getTheme.jsx';
import { getUsername, InitRequest, setToken, setUsername } from '../../store/request.js';
import { DisableZoom } from '../../components/pub.jsx';
import { CheckLang } from '../../utils/common.js';
import { Api, AsyncApi } from '../../utils/request.js';
export const useGlobal = create((set, get) => {
  let userName = window.localStorage.getItem('userName') || 'guest';
  let token = window.localStorage.getItem('token') || '';
  return {
    load:0,
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
/////////////初始化/////////////
export  async function InitData(){
  InitRequest()
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
      auth()
}
  sessionStorage.setItem('app', 'false');
// 主题设置
const theme=GetTheme("home")
useGlobal.setState({
  theme:theme})
// widget
GetWidgetData();
}
 function auth(){
    Api.get({
      api:"login/auth_status",
      end:()=>{
        useGlobal.setState({load:useGlobal.getState().load+1})
      },
      fail:()=>{
            window.localStorage.setItem('userName',"guest");
            window.localStorage.setItem('token',"");
            useGlobal.setState({load:useGlobal.getState().load+1})
            setUsername("guest")
            setToken("")
      }
    })
}

export function GetWidgetData(){
    const user=getUsername();
    Api.post({
      body:{user},
      api:"home/widget",
      success:(data)=>{
        useGlobal.setState({widgetData:data,load:useGlobal.getState().load+1})
      }
    })
}
// ///////////////////////////获取密钥////////////////////////////////
async function GetKey() {
  return  atob(await AsyncApi.get({
    api:"login/login"
  }));
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