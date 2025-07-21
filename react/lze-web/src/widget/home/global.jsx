import { create } from 'zustand';
import { notify } from '../public/notify.jsx'
export const useGlobal = create((set, get) => {
  let userName = window.localStorage.getItem('userName') || 'visitor';
  let token = window.localStorage.getItem('token') || '';

  // 调用 auth 只一次（等价于 useEffect）
  auth(userName, token);

  return {
    userName,
    token,
    showBg: false,
    locked:true,

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
export function auth(name,token){
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
                window.localStorage.setItem('userName',"visitor");
                window.localStorage.setItem('token',"");
                window.location.reload();
            }
            else{
                notify(res.status+"错误")
            }
            throw new Error(`请求失败，状态码：${res.status}`);
        }
        notify("登录用户:"+(name=="visitor"?"游客":name))
    })
}
