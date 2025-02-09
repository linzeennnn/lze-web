const loginpage=document.getElementById('login-page');
const passbar=document.getElementById('pass-bar');
const hostbar=document.getElementById('host-bar');
const hostbox=document.getElementById('host-box');
let password;
let ip;
let logstatus;
let passtatus;
const login=document.getElementById('login');
const root = document.documentElement;
let token;
let enterpass = null; 
let enterip = null; 
 // 初始化数据
 const defaulthost = {
    host: [
    ]
};

// 回车事件
function enter(status,event){
    switch(status){
        case 1:
            if (event.key === 'Enter') {
                console.log("ip");
                addhost();
            }
            break;
        case 2:
            if (event.key === 'Enter') {
                console.log("pass");
                sendpass();
            }
            break;
    }
    enterevent=1;
}
// access
function access(){
    if(!getip()){
        ip = window.location.hostname;
        }
        else {
        ip =getip();
        }
        // 本地打开html
        if(ip==''){
          logstatus=0;
        }else if(ip!=''){
          logstatus=1;
          checklogin(0); 
        }
}
function sendpass() {
    const password = btoa(document.getElementById('password').value);

    fetch(`${protocol}//${ip}/code/auth/login.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 使用 IP 作为 key 存储 token
            localStorage.setItem(`authToken_${ip}`, data.token);
            reloadPage();
        } else {
            notify("验证失败: " + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function logout(){
    localStorage.removeItem(`authToken_${ip}`);
        notify("已登出");
        reloadPage();
}
function checklogin(status) {
   token =localStorage.getItem(`authToken_${ip}`)
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `${protocol}//${ip}/code/auth/check.php`, true); // 替换为你的 PHP 文件路径

    // 设置 Authorization 头部
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    // 处理响应
    xhr.onreadystatechange = function() {
        try {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    passtatus = 1;
                } else {
                    passtatus = 0;
                    loginicon();
                }
            }
        } 
        catch (error) {
            console.log(error);
            notify(error);
        }
    };

    xhr.send();
}







function loginicon(){
    root.style.setProperty('--login', 'url(../../icon/nologin_grey.svg)');
    root.style.setProperty('--loginhover', 'url(../../icon/nologin_white.svg)');
}
function xmlnologin(xml){
    if (xml.status=== 401) { 
        loginicon();
        checklogin();
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
        checklogin();
      } 
}
// switch ip
function switchip(){
    logstatus=0;
}

// check ip
function connect(){
    ip =document.getElementById('ip-input').value;
    logstatus ='1';
    checklogin(1);
    }
// local window ip login
function local(){
    ip = window.location.hostname;
    logstatus ='1';
    } 


// 从 localStorage 中获取数据
function gethost() {
    const hostlist = localStorage.getItem('host');
    return hostlist ? JSON.parse(hostlist) : defaulthost;
}

// 保存数据到 localStorage
function savehost(hostlist) {
    localStorage.setItem('host', JSON.stringify(hostlist));
}

// 清空所有数据
function clearData() {
    if (confirm('确定要清空所有数据吗？')) {
        localStorage.removeItem('host');
        creatlist();
    }
}
