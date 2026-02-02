import { create } from 'zustand';
import { notify,GetText, GetLocalLangType } from '../../utils/common.js'
import { getUsername, InitRequest, setToken, setUsername } from '../../store/request.js';
import { CheckLang } from '../../utils/common.js';
import { Api, AsyncApi } from '../../utils/request.js';
import { setLang } from '../../store/lang.js';
import { InitPageSession } from '../../utils/pageSession.js';
import { InitTheme } from '../../utils/theme.js';
import DisableZoom from '../../utils/private/disableZoom.js';
export const useGlobal = create((set, get) => {
  let userName = window.localStorage.getItem('userName') || 'guest';
  let token = window.localStorage.getItem('token') || '';
  return {
    load:0,
    showBg: false,
    locked:true,
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
  // 初始化lang
  setLang(GetLocalLangType())
  // 初始化请求
  InitRequest()
  DisableZoom()
// 拉取语言包
await CheckLang()
// 初始化session
InitPageSession()
sessionStorage.setItem('lze-web', 'true');
// 锁屏设置
if (sessionStorage.getItem('app') == 'true') {
  useGlobal.setState({ locked: false });
} else {
  useGlobal.setState({ locked: true });
// 登陆状态验证
auth()
}
  sessionStorage.setItem('app', 'false');
// 主题设置
InitTheme("home")
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
            window.localStorage.setItem('username',"guest");
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