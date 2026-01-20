import { create } from 'zustand';
import { notify,GetText, GetLocalLangType } from '../../utils/common.js'
import { GetTheme } from '../../components/getTheme.jsx';
import { getUsername, InitRequest, setToken, setUsername } from '../../store/request.js';
import { DisableZoom } from '../../components/pub.jsx';
import { CheckLang } from '../../utils/common.js';
import { Api, AsyncApi } from '../../utils/request.js';
import { setLang } from '../../store/lang.js';
import { InitPageSession } from '../../utils/pageSession.js';
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
//////////////////////获取widget的图标///////////////////////
export function GetIcon(type){
  let path;
  switch(type){
    case "doc":
      path=(<path fillRule="evenodd" d="M3 6a2 2 0 0 1 2-2h5.532a2 2 0 0 1 1.536.72l1.9 2.28H3V6Zm0 3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9H3Z" clipRule="evenodd"/>)
      break;
    case "pic":
      path=(<><path fillRule="evenodd" d="M13 10a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H14a1 1 0 0 1-1-1Z" clipRule="evenodd"/>
  <path fillRule="evenodd" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12c0 .556-.227 1.06-.593 1.422A.999.999 0 0 1 20.5 20H4a2.002 2.002 0 0 1-2-2V6Zm6.892 12 3.833-5.356-3.99-4.322a1 1 0 0 0-1.549.097L4 12.879V6h16v9.95l-3.257-3.619a1 1 0 0 0-1.557.088L11.2 18H8.892Z" clipRule="evenodd"/></>);
      break;
    case "tra":
      path=(<path fillRule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clipRule="evenodd"/>);
      break;
    case "mon":
      path=(<path d="M5 13.17a3.001 3.001 0 0 0 0 5.66V20a1 1 0 1 0 2 0v-1.17a3.001 3.001 0 0 0 0-5.66V4a1 1 0 0 0-2 0v9.17ZM11 20v-9.17a3.001 3.001 0 0 1 0-5.66V4a1 1 0 1 1 2 0v1.17a3.001 3.001 0 0 1 0 5.66V20a1 1 0 1 1-2 0Zm6-1.17V20a1 1 0 1 0 2 0v-1.17a3.001 3.001 0 0 0 0-5.66V4a1 1 0 1 0-2 0v9.17a3.001 3.001 0 0 0 0 5.66Z"/>);
      break;
    case "not":
      path=(<path fillRule="evenodd" d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2Zm6 1h-4v2H9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2h-1V4Zm-3 8a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-2-1a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H9Zm2 5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-2-1a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H9Z" clipRule="evenodd"/>);
      break;
    case "bok":
      path=(<path d="M7.833 2c-.507 0-.98.216-1.318.576A1.92 1.92 0 0 0 6 3.89V21a1 1 0 0 0 1.625.78L12 18.28l4.375 3.5A1 1 0 0 0 18 21V3.889c0-.481-.178-.954-.515-1.313A1.808 1.808 0 0 0 16.167 2H7.833Z"/>);
      break;
    case "file":
        path=(<path fillRule="evenodd" d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Z" clipRule="evenodd"/>)
      break;
  }
  return(
      <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" 
      fill="var(--base_color)" viewBox="0 0 24 24">
        {path}
      </svg>
    )
}