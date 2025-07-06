import { notify } from '../public/notify.jsx'
// 跳转页面
export function to_next(type){
window.location.href=type+'.html';
}
// 登录
export function login(name,password){
    fetch(window.location.origin+'/server/login/login',
        {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
           name,password
        })
    }
    )
    .then(res=>{
        if(!res.ok){
            if(res.status===401){
                notify("账号或密码错误")
            }
            else{
                notify(res.status+"错误")
            }
            throw new Error(`请求失败，状态码：${res.status}`);
        }
        
        return res.json()})
    .then(data=>{
        window.localStorage.setItem('userName',name);
        window.localStorage.setItem('token',data.token);
                window.location.reload();

    })

}
// 验证用户
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
// 登出
export function logout(){
    if (confirm("确定退出登录吗？")) {
    localStorage.clear();
    window.location.reload();
    }
}