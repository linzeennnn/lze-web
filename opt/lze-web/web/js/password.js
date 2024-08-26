const passpage=document.getElementById('pass-page');
let password;
const login=document.getElementById('login');
const root = document.documentElement;
const token = localStorage.getItem('authToken');
function showlogin(status){
   if(status==1){ 
passpage.style.display='flex';
setTimeout(function () { 
passpage.style.opacity='1';
  }, 10);
   }
   else if(status==0){
passpage.style.opacity='';
setTimeout(function () { 
    passpage.style.display='';
      }, 1000);
   }
}
function sendpass(){
    password = btoa(document.getElementById('password').value);
    fetch(`http://${ip}/code/auth/login.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('authToken', data.token);
            reloadPage();
        } else {
            notify("验证失败:"+ data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}
function logout(){
    localStorage.removeItem('authToken');
        notify("已登出");
        reloadPage();
}
function checklogin(){
    // 假设你在前端要访问另一个受保护的PHP文件
fetch(`http://${ip}/code/auth/check.php`, {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
    }
})
.then(response => response.json())
.then(data => {
    if (data.success) {
       notify("已登陆");
    } else {
        loginicon();
       notify("未登陆");
    }
})
.catch(error => console.error('Error:', error));

}
function loginicon(){
    root.style.setProperty('--login', 'url(../../icon/nologin_grey.svg)');
    root.style.setProperty('--loginhover', 'url(../../icon/nologin_white.svg)');
}
function xmlnologin(xml){
    if (xml.status=== 401) { 
        loginicon();
        notify("验证失败");
        showlogin(1);
    }
}
function xmltoken(xml){
    if (token) {
        xml.setRequestHeader('Authorization', `Bearer ${token}`);
    }
}
function fetchtoken(){
    return{
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    }
}
function fetchnologin(response){
    if (response.status === 401) {
        loginicon();
        notify("验证失败");
        showlogin(1);
      } 
}